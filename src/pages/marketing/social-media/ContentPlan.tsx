
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RefreshCcw, CalendarIcon, FileText, Link, ExternalLink, Download } from "lucide-react";
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

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  placeholder?: string;
  inputType?: "text" | "url";
}

const InputDialog: React.FC<InputDialogProps> = ({
  open,
  onOpenChange,
  title,
  value,
  onChange,
  onSave,
  placeholder = "Enter value",
  inputType = "text"
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <input
              type={inputType}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" onClick={onSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
    productionTeam,
    contentPillars,
    getFilteredSubServices,
    resetRevisionCounter,
    resetProductionRevisionCounter,
    calculateOnTimeStatus
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
  
  // State for link dialogs
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState("");
  const [linkDialogType, setLinkDialogType] = useState<"googleDrive" | "postLink">("googleDrive");
  
  // Select all checkbox state
  const selectAll = contentItems.length > 0 && contentItems.every(item => item.isSelected);
  
  // Check if any items are selected
  const hasSelectedItems = contentItems.some(item => item.isSelected);

  // Toggle calendar for a specific item
  const toggleCalendar = (itemId: string, type: 'postDate' | 'completionDate' | 'productionCompletionDate' | 'productionApprovedDate' | 'actualPostDate') => {
    const key = `${itemId}-${type}`;
    setIsCalendarOpen(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle date change for a specific item
  const handleDateChange = (itemId: string, date: Date | undefined, type: 'postDate' | 'completionDate' | 'productionCompletionDate' | 'productionApprovedDate' | 'actualPostDate') => {
    if (date) {
      updateContentItem(itemId, { [type]: date.toISOString() });
      
      // Update onTimeStatus if actualPostDate changes
      if (type === 'actualPostDate') {
        const item = contentItems.find(i => i.id === itemId);
        if (item) {
          const onTimeStatus = calculateOnTimeStatus(item.postDate, date.toISOString());
          updateContentItem(itemId, { onTimeStatus });
        }
      }
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
  
  // Handle PIC Production change
  const handlePICProductionChange = (itemId: string, picName: string) => {
    updateContentItem(itemId, { picProduction: picName });
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
  
  // Open link dialog for editing
  const openLinkDialog = (itemId: string, type: "googleDrive" | "postLink", currentValue: string) => {
    setEditingItemId(itemId);
    setCurrentLink(currentValue);
    setLinkDialogType(type);
    setLinkDialogOpen(true);
  };
  
  // Save link from dialog
  const saveLinkDialog = () => {
    if (linkDialogType === "googleDrive") {
      updateContentItem(editingItemId, { 
        googleDriveLink: currentLink,
        // Reset production status if google drive link changes
        productionStatus: "none"  
      });
    } else {
      const now = new Date();
      updateContentItem(editingItemId, { 
        postLink: currentLink,
        // Set actual post date when link is added
        actualPostDate: currentLink ? now.toISOString() : undefined 
      });
      
      // Calculate on-time status
      const item = contentItems.find(i => i.id === editingItemId);
      if (item && item.postDate && currentLink) {
        const onTimeStatus = calculateOnTimeStatus(item.postDate, now.toISOString());
        updateContentItem(editingItemId, { onTimeStatus });
      }
    }
    setLinkDialogOpen(false);
    setEditingItemId("");
  };

  // Handle status change
  const handleStatusChange = (itemId: string, status: string) => {
    const updates: Partial<typeof contentItems[0]> = { status };
    
    // If status changes to "review", add completion date
    if (status === "review") {
      const now = new Date();
      updates.completionDate = now.toISOString();
    }
    
    // If status changes to "revision", increment revision counter
    if (status === "revision") {
      const item = contentItems.find(item => item.id === itemId);
      if (item) {
        updates.revisionCount = (item.revisionCount || 0) + 1;
      }
    }
    
    updateContentItem(itemId, updates);
  };
  
  // Handle production status change
  const handleProductionStatusChange = (itemId: string, status: string) => {
    const updates: Partial<typeof contentItems[0]> = { productionStatus: status };
    
    // If status changes to "review", add completion date
    if (status === "review") {
      const now = new Date();
      updates.productionCompletionDate = now.toISOString();
    }
    
    // If status changes to "revision", increment revision counter
    if (status === "revision") {
      const item = contentItems.find(item => item.id === itemId);
      if (item) {
        updates.productionRevisionCount = (item.productionRevisionCount || 0) + 1;
      }
    }
    
    updateContentItem(itemId, updates);
  };
  
  // Handle content status change
  const handleContentStatusChange = (itemId: string, status: string) => {
    updateContentItem(itemId, { contentStatus: status });
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
        
        // Check for Google Drive link change
        if (prevItem && prevItem.googleDriveLink !== currentItem.googleDriveLink && currentItem.googleDriveLink) {
          // Google Drive link changed, reset production status
          updateContentItem(currentItem.id, { productionStatus: "none" });
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
  
  // Handle approval changes and set approval date
  const handleApprovalChange = (itemId: string, isApproved: boolean, field: "isApproved" | "productionApproved") => {
    const now = new Date();
    const updates: Partial<typeof contentItems[0]> = { 
      [field]: isApproved 
    };
    
    // Set the approval date if approving production
    if (field === "productionApproved" && isApproved) {
      updates.productionApprovedDate = now.toISOString();
    } else if (field === "productionApproved" && !isApproved) {
      updates.productionApprovedDate = undefined;
    }
    
    updateContentItem(itemId, updates);
  };
  
  // Handle done status change
  const handleDoneStatusChange = (itemId: string, isDone: boolean) => {
    updateContentItem(itemId, { isDone });
  };

  // Format date for display
  const formatDisplayDate = (dateString: string | undefined, includeTime: boolean = true) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return includeTime 
        ? format(date, "dd MMM yyyy - HH:mm")
        : format(date, "dd MMM yyyy");
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
            {/* Horizontal scroll container - updated to ensure full width */}
            <div className="w-full overflow-x-auto">
              {/* Removed fixed width constraints to allow table to expand fully */}
              <div className="w-full">
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
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Tanggal Posting</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Tipe Content</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">PIC</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Layanan</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Sub Layanan</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Judul Content</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Content Pillar</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Brief</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Status</TableHead>
                      <TableHead className="w-[80px] text-center whitespace-nowrap">Revision</TableHead>
                      <TableHead className="w-[80px] text-center whitespace-nowrap">Approved</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Tanggal Selesai</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Tanggal Upload</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Tipe Content</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Judul Content</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">PIC Produksi</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Link Google Drive</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Status Produksi</TableHead>
                      <TableHead className="w-[80px] text-center whitespace-nowrap">Revisi Counter</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Tanggal Selesai Produksi</TableHead>
                      <TableHead className="w-[80px] text-center whitespace-nowrap">Approved</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Tanggal Approved</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Download Link File</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Link Post</TableHead>
                      <TableHead className="w-[80px] text-center whitespace-nowrap">Done</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Actual Post</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">On Time Status</TableHead>
                      <TableHead className="w-[120px] text-center whitespace-nowrap">Status Content</TableHead>
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
                                  {item.postDate ? formatDisplayDate(item.postDate, false) : 'Select date'}
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
                                  handleApprovalChange(item.id, true, "isApproved");
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
                            {item.postDate ? formatDisplayDate(item.postDate, false) : "-"}
                          </TableCell>
                          <TableCell className="p-2">
                            {/* Mirroring the contentType column */}
                            {contentTypes.find(type => type.id === item.contentType)?.name || "-"}
                          </TableCell>
                          <TableCell className="p-2">
                            {/* Mirroring the title column */}
                            {item.title ? 
                              (item.title.length > 25 ? 
                                `${item.title.substring(0, 25)}...` : 
                                item.title) : 
                              '-'}
                          </TableCell>
                          <TableCell className="p-2">
                            <Select 
                              value={item.picProduction} 
                              onValueChange={(value) => handlePICProductionChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select Production PIC" />
                              </SelectTrigger>
                              <SelectContent>
                                {productionTeam.length > 0 ? (
                                  productionTeam.map((member) => (
                                    <SelectItem key={member.id} value={member.name}>
                                      {member.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="no-pic-found" disabled>
                                    No production team found
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-2">
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              onClick={() => openLinkDialog(item.id, "googleDrive", item.googleDriveLink)}
                            >
                              <Link className="mr-2 h-4 w-4" />
                              {item.googleDriveLink ? 
                                (item.googleDriveLink.length > 25 ? 
                                  `${item.googleDriveLink.substring(0, 25)}...` : 
                                  item.googleDriveLink) : 
                                'Add Google Drive link'}
                            </Button>
                          </TableCell>
                          <TableCell className="p-2">
                            <Select 
                              value={item.productionStatus} 
                              onValueChange={(value) => handleProductionStatusChange(item.id, value)}
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
                              <span>{item.productionRevisionCount || 0}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => resetProductionRevisionCounter(item.id)}
                                className="h-6 w-6"
                              >
                                <RefreshCcw className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            {item.productionStatus === "review" && item.productionCompletionDate ? (
                              <div className="text-center">
                                {formatDisplayDate(item.productionCompletionDate)}
                              </div>
                            ) : null}
                          </TableCell>
                          <TableCell className="p-2 text-center">
                            <Checkbox 
                              checked={item.productionApproved}
                              onCheckedChange={(checked) => {
                                handleApprovalChange(item.id, Boolean(checked), "productionApproved");
                              }}
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            {item.productionApproved && item.productionApprovedDate ? (
                              <div className="text-center">
                                {formatDisplayDate(item.productionApprovedDate)}
                              </div>
                            ) : null}
                          </TableCell>
                          <TableCell className="p-2">
                            {item.productionApproved && item.googleDriveLink ? (
                              <Button
                                variant="outline"
                                className="w-full flex items-center justify-center"
                                onClick={() => window.open(item.googleDriveLink, "_blank")}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            ) : null}
                          </TableCell>
                          <TableCell className="p-2">
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              onClick={() => openLinkDialog(item.id, "postLink", item.postLink)}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              {item.postLink ? 
                                (item.postLink.length > 25 ? 
                                  `${item.postLink.substring(0, 25)}...` : 
                                  item.postLink) : 
                                'Add post link'}
                            </Button>
                          </TableCell>
                          <TableCell className="p-2 text-center">
                            <Checkbox 
                              checked={item.isDone}
                              onCheckedChange={(checked) => {
                                handleDoneStatusChange(item.id, Boolean(checked));
                              }}
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            {item.actualPostDate ? (
                              <div className="text-center">
                                {formatDisplayDate(item.actualPostDate)}
                              </div>
                            ) : null}
                          </TableCell>
                          <TableCell className="p-2">
                            <div className={`text-center ${item.onTimeStatus?.startsWith('Late') ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}`}>
                              {item.onTimeStatus || "-"}
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            <Select 
                              value={item.contentStatus} 
                              onValueChange={(value) => handleContentStatusChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="-" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">-</SelectItem>
                                <SelectItem value="recommended">Recommended For Ads</SelectItem>
                                <SelectItem value="cancel">Cancel</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={29} className="h-24 text-center">
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
      
      {/* Dialog for link editing */}
      <InputDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        title={linkDialogType === "googleDrive" ? "Add Google Drive Link" : "Add Post Link"}
        value={currentLink}
        onChange={setCurrentLink}
        onSave={saveLinkDialog}
        placeholder={linkDialogType === "googleDrive" ? "Enter Google Drive link" : "Enter post link"}
        inputType="url"
      />

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
