
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useContentManagement } from "@/hooks/useContentManagement";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    getFilteredSubServices,
    contentPlanners
  } = useContentManagement();

  // State for calendar popovers
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  
  // Select all checkbox state
  const selectAll = contentItems.length > 0 && contentItems.every(item => item.isSelected);
  
  // Check if any items are selected
  const hasSelectedItems = contentItems.some(item => item.isSelected);

  // State for full title dialog
  const [isFullTitleOpen, setIsFullTitleOpen] = useState(false);
  const [currentFullTitle, setCurrentFullTitle] = useState("");

  // Toggle calendar for a specific item
  const toggleCalendar = (itemId: string) => {
    setIsCalendarOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle date change for a specific item
  const handleDateChange = (itemId: string, date: Date | undefined) => {
    if (date) {
      updateContentItem(itemId, { postDate: date.toISOString().split('T')[0] });
    }
    setIsCalendarOpen(prev => ({
      ...prev,
      [itemId]: false
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
    const updatedItem: any = { service: serviceId };
    
    // Clear sub-service when changing service
    updatedItem.subService = "";
    
    updateContentItem(itemId, updatedItem);
  };

  // Handle sub-service change
  const handleSubServiceChange = (itemId: string, subServiceId: string) => {
    updateContentItem(itemId, { subService: subServiceId });
  };

  // Handle title change
  const handleTitleChange = (itemId: string, title: string) => {
    updateContentItem(itemId, { title });
  };

  // Show full title in dialog
  const showFullTitle = (title: string) => {
    if (title && title.length > 0) {
      setCurrentFullTitle(title);
      setIsFullTitleOpen(true);
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
        <div className="relative border rounded-md">
          <ScrollArea className="h-[calc(100vh-230px)]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[60px] text-center">
                      <Checkbox 
                        checked={selectAll} 
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                        className="ml-2"
                      />
                    </TableHead>
                    <TableHead className="w-[150px] text-center whitespace-nowrap">Tanggal Posting</TableHead>
                    <TableHead className="w-[150px] text-center whitespace-nowrap">Tipe Content</TableHead>
                    <TableHead className="w-[150px] text-center whitespace-nowrap">PIC</TableHead>
                    <TableHead className="w-[150px] text-center whitespace-nowrap">Layanan</TableHead>
                    <TableHead className="w-[150px] text-center whitespace-nowrap">Sub Layanan</TableHead>
                    <TableHead className="w-[180px] text-center whitespace-nowrap">Judul Content</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentItems.length > 0 ? (
                    contentItems.map(item => (
                      <TableRow key={item.id} className="hover:bg-slate-50/60">
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={item.isSelected} 
                            onCheckedChange={() => toggleSelectItem(item.id)}
                            aria-label="Select row"
                          />
                        </TableCell>
                        <TableCell className="p-2">
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
                            disabled={!item.service}
                          >
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select sub-service" />
                            </SelectTrigger>
                            <SelectContent>
                              {item.service ? (
                                getFilteredSubServices(item.service).map((subService) => (
                                  <SelectItem key={subService.id} value={subService.id}>
                                    {subService.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="select-service-first" disabled>
                                  Select a service first
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="p-2">
                          <div 
                            className="relative cursor-pointer"
                            onClick={() => showFullTitle(item.title || "")}
                          >
                            <Input
                              value={item.title || ""}
                              onChange={(e) => handleTitleChange(item.id, e.target.value)}
                              placeholder="Enter title"
                              className="w-full bg-white"
                              maxLength={100}
                              onClick={(e) => e.stopPropagation()}
                            />
                            {item.title && item.title.length > 25 && (
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                ...
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No content items. Click "Add Row" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </div>
      </CardContent>

      {/* Full Title Dialog */}
      <Dialog open={isFullTitleOpen} onOpenChange={setIsFullTitleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Content Title</DialogTitle>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-slate-50">
            {currentFullTitle}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ContentPlan;
