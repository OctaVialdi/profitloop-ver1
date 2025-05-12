
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RefreshCcw, CalendarIcon, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useContentManagement } from "@/hooks/useContentManagement";
import { useContentBrief } from "@/hooks/useContentBrief";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BriefDialog } from "@/components/marketing/social-media/BriefDialog";
import { format } from "date-fns";

const ContentPlan = () => {
  const { toast } = useToast();
  const {
    contentTypes,
    services,
    subServices,
    contentItems,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    contentPlanners,
    contentPillars,
    getFilteredSubServices,
    resetRevisionCounter
  } = useContentManagement();

  // Initialize the useContentBrief hook
  const {
    isBriefDialogOpen,
    setIsBriefDialogOpen,
    currentBrief,
    setCurrentBrief,
    currentItemId,
    briefDialogMode,
    setBriefDialogMode,
    extractGoogleDocsLink,
    displayBrief,
    openBriefDialog,
    saveBrief
  } = useContentBrief(updateContentItem);

  // State for calendar popovers
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  
  // State for title dialog
  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [editingItemId, setEditingItemId] = useState("");
  
  // Select all checkbox state
  const selectAll = contentItems.length > 0 && contentItems.every(item => item.isSelected);
  
  // Check if any items are selected
  const hasSelectedItems = contentItems.some(item => item.isSelected);

  // Toggle calendar for a specific item
  const toggleCalendar = (itemId: string, type: 'postDate' | 'completionDate') => {
    const key = `${itemId}-${type}`;
    setIsCalendarOpen(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle date change for a specific item
  const handleDateChange = (itemId: string, date: Date | undefined, type: 'postDate' | 'completionDate') => {
    if (date) {
      updateContentItem(itemId, { [type]: date.toISOString().split('T')[0] });
    }
    const key = `${itemId}-${type}`;
    setIsCalendarOpen(prev => ({
      ...prev,
      [key]: false
    }));
  };

  // Handle select/deselect all items
  const handleSelectAll = (checked: boolean) => {
    selectAllItems(checked);
  };

  // Handle delete selected items
  const handleDeleteSelected = () => {
    const selectedIds = contentItems
      .filter(item => item.isSelected)
      .map(item => item.id);
      
    if (selectedIds.length === 0) return;
    
    deleteContentItems(selectedIds);
    toast({
      title: `${selectedIds.length} item(s) deleted`,
      description: "The selected content items have been removed"
    });
  };

  // Handle content type change
  const handleTypeChange = (itemId: string, typeId: string) => {
    updateContentItem(itemId, { contentType: typeId });
  };

  // Handle PIC change
  const handlePICChange = (itemId: string, picName: string) => {
    updateContentItem(itemId, { pic: picName });
  };

  // Handle service change
  const handleServiceChange = (itemId: string, serviceId: string) => {
    // When service changes, we need to reset the subService
    updateContentItem(itemId, { service: serviceId, subService: "" });
  };
  
  // Handle subService change
  const handleSubServiceChange = (itemId: string, subServiceId: string) => {
    updateContentItem(itemId, { subService: subServiceId });
  };

  // Handle content pillar change
  const handleContentPillarChange = (itemId: string, pillarId: string) => {
    updateContentItem(itemId, { contentPillar: pillarId });
  };

  // Handle title change
  const handleTitleChange = (itemId: string, title: string) => {
    updateContentItem(itemId, { title });
  };

  // Open title dialog for editing
  const openTitleDialog = (itemId: string, currentTitle: string) => {
    setEditingItemId(itemId);
    setCurrentTitle(currentTitle);
    setTitleDialogOpen(true);
  };

  // Handle status change
  const handleStatusChange = (itemId: string, status: string) => {
    const updates: Partial<typeof contentItems[0]> = { status };
    
    // If status changes to "Butuh Di Review", add completion date
    if (status === "review") {
      const now = new Date();
      updates.completionDate = now.toISOString();
    }
    
    // If status changes to "Request Revisi", increment revision counter
    if (status === "revision") {
      const item = contentItems.find(item => item.id === itemId);
      if (item) {
        updates.revisionCount = (item.revisionCount || 0) + 1;
      }
    }
    
    updateContentItem(itemId, updates);
  };

  // Handle brief change and status update
  useEffect(() => {
    const handleBriefChange = (prevItems: typeof contentItems, currentItems: typeof contentItems) => {
      currentItems.forEach(currentItem => {
        const prevItem = prevItems.find(item => item.id === currentItem.id);
        if (prevItem && prevItem.brief !== currentItem.brief && currentItem.brief) {
          // Brief changed, reset status
          updateContentItem(currentItem.id, { status: "none" });
        }
      });
    };

    // Track previous items
    const prevItemsJSON = localStorage.getItem("prevContentItems");
    if (prevItemsJSON) {
      const prevItems = JSON.parse(prevItemsJSON);
      handleBriefChange(prevItems, contentItems);
    }
    
    // Save current items for next comparison
    localStorage.setItem("prevContentItems", JSON.stringify(contentItems));
  }, [contentItems]);

  // Format date for display
  const formatDisplayDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy - HH:mm");
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Content Plan</CardTitle>
        <div className="flex space-x-2">
          {hasSelectedItems && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDeleteSelected}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
          )}
          <Button 
            onClick={addContentItem} 
            size="sm" 
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          {/* Vertical scroll container */}
          <ScrollArea className="h-[calc(100vh-230px)]">
            {/* Horizontal scroll container - added overflow-x-auto to ensure horizontal scrolling */}
            <div className="overflow-x-auto">
              {/* Fixed width container for the table */}
              <div className="min-w-[1200px] max-w-[1300px] w-full">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-[60px] text-center sticky left-0 bg-slate-50 z-20">
                        <Checkbox 
                          checked={selectAll} 
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                          className="ml-2"
                        />
                      </TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Tanggal Posting</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Tipe Content</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">PIC</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Layanan</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Sub Layanan</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Judul Content</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Content Pillar</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Brief</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Status</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Revision</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Approved</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Tanggal Selesai</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Tanggal Upload</TableHead>
                      <TableHead className="w-[200px] text-center whitespace-nowrap">Tipe Content</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentItems.length > 0 ? (
                      contentItems.map(item => (
                        <TableRow key={item.id} className="hover:bg-slate-50/60">
                          <TableCell className="text-center sticky left-0 bg-white z-10">
                            <Checkbox 
                              checked={item.isSelected} 
                              onCheckedChange={() => toggleSelectItem(item.id)}
                              aria-label="Select row"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Popover 
                              open={isCalendarOpen[`${item.id}-postDate`]} 
                              onOpenChange={() => toggleCalendar(item.id, 'postDate')}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {item.postDate || 'Select date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 z-50" align="start">
                                <Calendar
                                  mode="single"
                                  selected={item.postDate ? new Date(item.postDate) : undefined}
                                  onSelect={(date) => handleDateChange(item.id, date, 'postDate')}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                          <TableCell className="p-2">
                            <Select 
                              value={item.contentType} 
                              onValueChange={(value) => handleTypeChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select content type" />
                              </SelectTrigger>
                              <SelectContent>
                                {contentTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-2">
                            <Select 
                              value={item.pic} 
                              onValueChange={(value) => handlePICChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select PIC" />
                              </SelectTrigger>
                              <SelectContent>
                                {contentPlanners.length > 0 ? (
                                  contentPlanners.map((planner) => (
                                    <SelectItem key={planner.id} value={planner.name}>
                                      {planner.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="no-pic-found" disabled>
                                    No content planners found
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-2">
                            <Select 
                              value={item.service} 
                              onValueChange={(value) => handleServiceChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select service" />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service.id} value={service.id}>
                                    {service.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-2">
                            <Select 
                              value={item.subService} 
                              onValueChange={(value) => handleSubServiceChange(item.id, value)}
                              disabled={!item.service} // Disable if no service is selected
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select sub service" />
                              </SelectTrigger>
                              <SelectContent>
                                {item.service ? (
                                  getFilteredSubServices(item.service).map((subService) => (
                                    <SelectItem key={subService.id} value={subService.id}>
                                      {subService.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="no-subservice" disabled>
                                    Select a service first
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-2">
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal truncate"
                              onClick={() => openTitleDialog(item.id, item.title)}
                            >
                              {item.title ? 
                                (item.title.length > 25 ? 
                                  `${item.title.substring(0, 25)}...` : 
                                  item.title) : 
                                'Click to add title'}
                            </Button>
                          </TableCell>
                          <TableCell className="p-2">
                            <Select 
                              value={item.contentPillar} 
                              onValueChange={(value) => handleContentPillarChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select content pillar" />
                              </SelectTrigger>
                              <SelectContent>
                                {contentPillars.map((pillar) => (
                                  <SelectItem key={pillar.id} value={pillar.id}>
                                    {pillar.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-2">
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              onClick={() => openBriefDialog(item.id, item.brief, item.brief ? "view" : "edit")}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {item.brief ? displayBrief(item.brief) : 'Click to add brief'}
                            </Button>
                          </TableCell>
                          <TableCell className="p-2">
                            <Select 
                              value={item.status} 
                              onValueChange={(value) => handleStatusChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="-" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">-</SelectItem>
                                <SelectItem value="review">Butuh Di Review</SelectItem>
                                <SelectItem value="revision">Request Revisi</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-2 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span>{item.revisionCount || 0}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => resetRevisionCounter(item.id)}
                                className="h-6 w-6"
                              >
                                <RefreshCcw className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="p-2 text-center">
                            <Checkbox 
                              checked={item.isApproved}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateContentItem(item.id, { isApproved: true });
                                }
                              }}
                              disabled={item.isApproved} // Once checked, it can't be unchecked
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            {item.status === "review" && item.completionDate ? (
                              <div className="text-center">
                                {formatDisplayDate(item.completionDate)}
                              </div>
                            ) : null}
                          </TableCell>
                          <TableCell className="p-2">
                            {/* Mirroring the postDate column */}
                            {item.postDate || "-"}
                          </TableCell>
                          <TableCell className="p-2">
                            {/* Mirroring the contentType column */}
                            {contentTypes.find(type => type.id === item.contentType)?.name || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={15} className="h-24 text-center">
                          No content items. Click "Add Row" to create one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ScrollArea>
        </div>
      </CardContent>

      {/* Dialog for full title editing */}
      <Dialog open={titleDialogOpen} onOpenChange={setTitleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Content Title</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <input
                id="title"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="Enter complete title"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" onClick={() => {
                if (editingItemId) {
                  updateContentItem(editingItemId, { title: currentTitle });
                  setTitleDialogOpen(false);
                  setEditingItemId("");
                }
              }}>Save Title</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Brief Dialog Component */}
      <BriefDialog
        isOpen={isBriefDialogOpen}
        onOpenChange={setIsBriefDialogOpen}
        currentBrief={currentBrief}
        setCurrentBrief={setCurrentBrief}
        mode={briefDialogMode}
        setMode={setBriefDialogMode}
        saveBrief={saveBrief}
        extractGoogleDocsLink={extractGoogleDocsLink}
      />
    </Card>
  );
};

export default ContentPlan;
