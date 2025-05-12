import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle, Trash2, RefreshCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { toast } from "sonner";
import { useContentManagement } from "@/hooks/useContentManagement";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const CreateContent = () => {
  const {
    contentTypes,
    contentItems,
    picOptions,
    serviceOptions,
    subServiceOptions,
    contentPillarOptions,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    getSubServices
  } = useContentManagement();

  const [selectAll, setSelectAll] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  const [briefDialogOpen, setBriefDialogOpen] = useState<{ [key: string]: boolean }>({});
  const [titleDialogOpen, setTitleDialogOpen] = useState<{ [key: string]: boolean }>({});
  
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

  const handlePICChange = (itemId: string, picId: string) => {
    updateContentItem(itemId, { picId: picId });
  };

  const handleServiceChange = (itemId: string, serviceId: string) => {
    // Reset subService when service changes
    updateContentItem(itemId, { 
      serviceId: serviceId, 
      subServiceId: '' 
    });
  };

  const handleSubServiceChange = (itemId: string, subServiceId: string) => {
    updateContentItem(itemId, { subServiceId: subServiceId });
  };

  const handleContentPillarChange = (itemId: string, pillarId: string) => {
    updateContentItem(itemId, { contentPillarId: pillarId });
  };

  const handleTitleChange = (itemId: string, title: string) => {
    updateContentItem(itemId, { title: title });
    setTitleDialogOpen(prev => ({
      ...prev,
      [itemId]: false
    }));
  };

  const handleBriefChange = (itemId: string, brief: string) => {
    updateContentItem(itemId, { 
      brief: brief,
      status: '' // Reset status when brief is updated
    });
    setBriefDialogOpen(prev => ({
      ...prev,
      [itemId]: false
    }));
  };

  const handleStatusChange = (itemId: string, status: string) => {
    const item = contentItems.find(item => item.id === itemId);
    let newRevisionCount = item?.revisionCount || 0;
    
    // If changing to "Request Revisi", increment revision count
    if (status === "request-revision") {
      newRevisionCount += 1;
    }
    
    // If changing to "Butuh Di Review", set completion date
    const completionDate = status === "needs-review" ? 
      format(new Date(), 'dd MMM yyyy - HH:mm') : 
      item?.completionDate || '';

    updateContentItem(itemId, { 
      status: status,
      revisionCount: newRevisionCount,
      completionDate: completionDate
    });
  };

  const resetRevisionCount = (itemId: string) => {
    updateContentItem(itemId, { revisionCount: 0 });
    toast.success("Revision count reset");
  };

  const handleApprovedChange = (itemId: string, checked: boolean) => {
    updateContentItem(itemId, { isApproved: checked });
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

  const openBriefDialog = (itemId: string) => {
    setBriefDialogOpen(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const openTitleDialog = (itemId: string) => {
    setTitleDialogOpen(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  // Function to truncate text to a specific length
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Function to detect and make URLs clickable
  const processLinks = (text: string) => {
    if (!text) return '';
    // Simple regex for detecting URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => 
      `<a href="${url}" target="_blank" class="text-blue-500 underline">${url}</a>`
    );
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
        {/* Container with fixed dimensions and overflow handling */}
        <div className="border rounded-md w-full relative overflow-hidden">
          {/* Fixed width for the main wrapper with horizontal scrolling */}
          <div className="max-w-full">
            {/* Header table with sticky positioning and fixed width columns */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1800px]"> {/* Minimum width to accommodate all columns */}
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-20">
                    <TableRow>
                      <TableHead className="w-12 text-center sticky left-0 bg-background z-30">
                        <Checkbox 
                          checked={selectAll} 
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead className="w-36 text-center">Tanggal Posting</TableHead>
                      <TableHead className="w-36 text-center">Tipe Content</TableHead>
                      <TableHead className="w-36 text-center">PIC</TableHead>
                      <TableHead className="w-36 text-center">Layanan</TableHead>
                      <TableHead className="w-36 text-center">Sub Layanan</TableHead>
                      <TableHead className="w-36 text-center">Judul Content</TableHead>
                      <TableHead className="w-36 text-center">Content Pillar</TableHead>
                      <TableHead className="w-36 text-center">Brief</TableHead>
                      <TableHead className="w-36 text-center">Status</TableHead>
                      <TableHead className="w-24 text-center">Revision</TableHead>
                      <TableHead className="w-24 text-center">Approved</TableHead>
                      <TableHead className="w-36 text-center">Tanggal Selesai</TableHead>
                      <TableHead className="w-36 text-center">Tanggal Upload</TableHead>
                      <TableHead className="w-36 text-center">Tipe Content</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>
            </div>
            
            {/* Body table with vertical scrolling and fixed width columns matching header */}
            <ScrollArea className="h-[400px]">
              <div className="min-w-[1800px]"> {/* Ensure same minimum width as header */}
                <Table>
                  <TableBody>
                    {contentItems.length > 0 ? (
                      contentItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="sticky left-0 bg-background z-10">
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
                              value={item.contentType || "placeholder"} 
                              onValueChange={(value) => handleTypeChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="-" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placeholder">-</SelectItem>
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
                              value={item.picId || "placeholder"} 
                              onValueChange={(value) => handlePICChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="-" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placeholder">-</SelectItem>
                                {picOptions.map((pic) => (
                                  <SelectItem key={pic.id} value={pic.id}>
                                    {pic.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={item.serviceId || "placeholder"} 
                              onValueChange={(value) => handleServiceChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="-" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placeholder">-</SelectItem>
                                {serviceOptions.map((service) => (
                                  <SelectItem key={service.id} value={service.id}>
                                    {service.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={item.subServiceId || "placeholder"} 
                              onValueChange={(value) => handleSubServiceChange(item.id, value)}
                              disabled={!item.serviceId || item.serviceId === "placeholder"}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="-" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placeholder">-</SelectItem>
                                {item.serviceId && item.serviceId !== "placeholder" && subServiceOptions
                                  .filter(sub => sub.parentId === item.serviceId)
                                  .map((subService) => (
                                    <SelectItem key={subService.id} value={subService.id}>
                                      {subService.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Dialog 
                              open={titleDialogOpen[item.id]} 
                              onOpenChange={(open) => setTitleDialogOpen(prev => ({...prev, [item.id]: open}))}
                            >
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="w-full justify-start text-left h-auto py-2"
                                >
                                  {truncateText(item.title || 'Click to add title', 25)}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Content Title</DialogTitle>
                                </DialogHeader>
                                <Input
                                  defaultValue={item.title || ''}
                                  onChange={(e) => handleTitleChange(item.id, e.target.value)}
                                  className="w-full"
                                  placeholder="Enter content title"
                                />
                                <DialogClose asChild>
                                  <Button type="button">Save</Button>
                                </DialogClose>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={item.contentPillarId || "placeholder"} 
                              onValueChange={(value) => handleContentPillarChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="-" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placeholder">-</SelectItem>
                                {contentPillarOptions.map((pillar) => (
                                  <SelectItem key={pillar.id} value={pillar.id}>
                                    {pillar.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Dialog 
                              open={briefDialogOpen[item.id]} 
                              onOpenChange={(open) => setBriefDialogOpen(prev => ({...prev, [item.id]: open}))}
                            >
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="w-full justify-start text-left h-auto py-2"
                                >
                                  {item.brief ? truncateText(item.brief, 25) : 'Click to add brief'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Content Brief</DialogTitle>
                                </DialogHeader>
                                <Textarea
                                  defaultValue={item.brief || ''}
                                  onChange={(e) => handleBriefChange(item.id, e.target.value)}
                                  className="w-full h-60"
                                  placeholder="Enter brief details (paste Google Docs links for direct access)"
                                />
                                {item.brief && item.brief.includes('docs.google.com') && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-2">Document Preview:</h4>
                                    <iframe
                                      src={item.brief.match(/(https?:\/\/docs.google.com\/[^\s]+)/)?.[0] + '?embedded=true'}
                                      className="w-full h-60 border rounded"
                                    />
                                  </div>
                                )}
                                <DialogClose asChild>
                                  <Button type="button">Save</Button>
                                </DialogClose>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.status || "placeholder"}
                              onValueChange={(value) => handleStatusChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="-" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placeholder">-</SelectItem>
                                <SelectItem value="needs-review">Butuh Di Review</SelectItem>
                                <SelectItem value="request-revision">Request Revisi</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-1">
                              <span className="font-medium">{item.revisionCount || 0}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={() => resetRevisionCount(item.id)}
                              >
                                <RefreshCcw className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox 
                              checked={item.isApproved || false} 
                              onCheckedChange={(checked) => handleApprovedChange(item.id, checked === true)}
                              aria-label="Approve content"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {item.status === 'needs-review' ? item.completionDate : ''}
                          </TableCell>
                          <TableCell>
                            {item.postDate || ''}
                          </TableCell>
                          <TableCell>
                            {contentTypes.find(type => type.id === item.contentType)?.name || ''}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={15} className="h-[300px] text-center">
                          <div className="h-full w-full flex items-center justify-center">
                            No content items. Click "Add Row" to create one.
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {contentItems.length} item{contentItems.length !== 1 ? 's' : ''} 
          {contentItems.some(item => item.isSelected) && 
            ` (${contentItems.filter(item => item.isSelected).length} selected)`
          }
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreateContent;
