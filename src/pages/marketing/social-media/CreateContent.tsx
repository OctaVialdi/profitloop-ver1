
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle, Trash2, ExternalLink, Edit, FileText, List, CircleDot } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { toast } from "sonner";
import { useContentManagement, ContentItem } from "@/hooks/useContentManagement";
import { Textarea } from "@/components/ui/textarea";

const CreateContent = () => {
  const {
    contentTypes,
    services,
    subServices,
    contentItems,
    contentPlanners,
    contentPillars,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    getFilteredSubServices
  } = useContentManagement();

  const [selectAll, setSelectAll] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentItemId, setCurrentItemId] = useState("");
  const [briefDialogMode, setBriefDialogMode] = useState<"edit" | "view">("edit");
  
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    selectAllItems(checked);
  };

  const handleAddRow = () => {
    addContentItem();
    toast.success("New content row added");
  };

  const handleDateChange = (itemId: string, date: Date | undefined) => {
    if (date) {
      updateContentItem(itemId, { postDate: format(date, 'yyyy-MM-dd') });
      
      // Close the calendar popover
      setIsCalendarOpen(prev => ({
        ...prev,
        [itemId]: false
      }));
    }
  };

  const handleTypeChange = (itemId: string, typeId: string) => {
    updateContentItem(itemId, { contentType: typeId });
  };

  const handlePICChange = (itemId: string, picName: string) => {
    updateContentItem(itemId, { pic: picName });
  };
  
  const handleServiceChange = (itemId: string, serviceId: string) => {
    // When service changes, reset subService
    updateContentItem(itemId, { 
      service: serviceId,
      subService: ""  
    });
  };
  
  const handleSubServiceChange = (itemId: string, subServiceId: string) => {
    updateContentItem(itemId, { subService: subServiceId });
  };

  const handleTitleChange = (itemId: string, title: string) => {
    // Limit to 25 characters
    const trimmedTitle = title.slice(0, 25);
    updateContentItem(itemId, { title: trimmedTitle });
  };

  const handleContentPillarChange = (itemId: string, pillarId: string) => {
    updateContentItem(itemId, { contentPillar: pillarId });
  };

  const handleStatusChange = (itemId: string, status: string) => {
    updateContentItem(itemId, { status });
  };

  const handleDeleteSelected = () => {
    const selectedIds = contentItems
      .filter(item => item.isSelected)
      .map(item => item.id);
    
    if (selectedIds.length === 0) {
      toast.error("No items selected for deletion");
      return;
    }
    
    deleteContentItems(selectedIds);
    setSelectAll(false);
    toast.success(`${selectedIds.length} items deleted`);
  };

  const toggleCalendar = (itemId: string) => {
    setIsCalendarOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const openBriefDialog = (itemId: string, brief: string, mode: "edit" | "view" = "edit") => {
    setCurrentItemId(itemId);
    setCurrentBrief(brief);
    setBriefDialogMode(mode);
    setIsBriefDialogOpen(true);
  };

  const saveBrief = () => {
    updateContentItem(currentItemId, { brief: currentBrief });
    setIsBriefDialogOpen(false);
    toast.success("Brief updated");
  };

  // Function to check and extract Google Docs link
  const extractGoogleDocsLink = (text: string): string | null => {
    const googleDocsRegex = /https:\/\/docs\.google\.com\/[^\s]+/g;
    const match = text.match(googleDocsRegex);
    return match ? match[0] : null;
  };

  // Function to display brief text with truncation
  const displayBrief = (brief: string): string => {
    return brief.length > 25 ? brief.substring(0, 25) + "..." : brief;
  };

  const getContentTypeName = (typeId: string) => {
    const contentType = contentTypes.find(type => type.id === typeId);
    return contentType ? contentType.name : "Unknown";
  };

  // Get filtered sub-services based on selected service
  const getFilteredSubServicesByServiceId = (serviceId: string) => {
    return subServices.filter(subService => subService.serviceId === serviceId);
  };

  return (
    <Card className="w-full">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Content Management</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteSelected}
            disabled={!contentItems.some(item => item.isSelected)}
            className="text-sm"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected
          </Button>
          <Button onClick={handleAddRow} size="sm" className="text-sm">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Row
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap" type="scroll">
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">
                    <Checkbox 
                      checked={selectAll} 
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-1/6 text-center">Tanggal Posting</TableHead>
                  <TableHead className="text-center">Tipe Content</TableHead>
                  <TableHead className="text-center">PIC</TableHead>
                  <TableHead className="text-center">Layanan</TableHead>
                  <TableHead className="text-center">Sub Layanan</TableHead>
                  <TableHead className="text-center">Judul Content</TableHead>
                  <TableHead className="text-center">Content Pillar</TableHead>
                  <TableHead className="text-center">Brief</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentItems.length > 0 ? (
                  contentItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={item.isSelected} 
                          onCheckedChange={() => toggleSelectItem(item.id)}
                          aria-label="Select row"
                        />
                      </TableCell>
                      <TableCell>
                        <Popover 
                          open={isCalendarOpen[item.id]} 
                          onOpenChange={() => toggleCalendar(item.id)}
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={item.postDate ? new Date(item.postDate) : undefined}
                              onSelect={(date) => handleDateChange(item.id, date)}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={item.contentType} 
                          onValueChange={(value) => handleTypeChange(item.id, value)}
                        >
                          <SelectTrigger className="w-full">
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
                      <TableCell>
                        <Select 
                          value={item.pic} 
                          onValueChange={(value) => handlePICChange(item.id, value)}
                        >
                          <SelectTrigger className="w-full">
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
                              <SelectItem value="no-pic" disabled>
                                No content planners found
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={item.service} 
                          onValueChange={(value) => handleServiceChange(item.id, value)}
                        >
                          <SelectTrigger className="w-full">
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
                      <TableCell>
                        <Select 
                          value={item.subService} 
                          onValueChange={(value) => handleSubServiceChange(item.id, value)}
                          disabled={!item.service}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select sub-service" />
                          </SelectTrigger>
                          <SelectContent>
                            {item.service ? (
                              getFilteredSubServicesByServiceId(item.service).map((subService) => (
                                <SelectItem key={subService.id} value={subService.id}>
                                  {subService.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-sub" disabled>
                                Select a service first
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                          <Input
                            value={item.title || ""}
                            onChange={(e) => handleTitleChange(item.id, e.target.value)}
                            placeholder="Enter title"
                            className="w-full"
                            maxLength={25}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={item.contentPillar} 
                          onValueChange={(value) => handleContentPillarChange(item.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <div className="flex items-center">
                              <List className="h-4 w-4 mr-2" />
                              <SelectValue placeholder="Select pillar" />
                            </div>
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
                      <TableCell>
                        {item.brief ? (
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-left truncate w-full"
                              onClick={() => openBriefDialog(item.id, item.brief, "view")}
                            >
                              {displayBrief(item.brief)}
                              {extractGoogleDocsLink(item.brief) && (
                                <ExternalLink className="ml-2 h-3 w-3 inline" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => openBriefDialog(item.id, item.brief)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            className="w-full justify-center"
                            onClick={() => openBriefDialog(item.id, "")}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Click to add brief
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={item.status} 
                          onValueChange={(value) => handleStatusChange(item.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <div className="flex items-center">
                              <CircleDot className="h-4 w-4 mr-2" />
                              <SelectValue placeholder="-" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-</SelectItem>
                            <SelectItem value="review">Butuh Di Review</SelectItem>
                            <SelectItem value="revisi">Request Revisi</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No content items. Click "Add Row" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {contentItems.length} item{contentItems.length !== 1 ? 's' : ''} 
          {contentItems.some(item => item.isSelected) && 
            ` (${contentItems.filter(item => item.isSelected).length} selected)`
          }
        </div>
      </CardFooter>

      {/* Brief Dialog */}
      <Dialog open={isBriefDialogOpen} onOpenChange={setIsBriefDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {briefDialogMode === "edit" ? "Edit Brief" : "View Brief"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {briefDialogMode === "edit" ? (
              <Textarea 
                value={currentBrief} 
                onChange={(e) => setCurrentBrief(e.target.value)}
                placeholder="Enter brief details here..."
                className="min-h-[200px]"
              />
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                  {currentBrief}
                </div>
                
                {extractGoogleDocsLink(currentBrief) && (
                  <div className="border rounded-md overflow-hidden">
                    <iframe 
                      src={`${extractGoogleDocsLink(currentBrief)}?embedded=true`}
                      className="w-full h-[400px]"
                      title="Google Doc"
                    ></iframe>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            {briefDialogMode === "edit" ? (
              <>
                <Button variant="outline" onClick={() => setIsBriefDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveBrief}>Save Brief</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsBriefDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => setBriefDialogMode("edit")}>Edit</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CreateContent;
