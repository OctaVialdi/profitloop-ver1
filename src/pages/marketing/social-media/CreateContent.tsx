
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle, Trash2, RefreshCcw, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { toast } from "sonner";
import { useContentManagement } from "@/hooks/useContentManagement";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const CreateContent = () => {
  const {
    contentTypes,
    contentItems,
    servicesList,
    subServicesList,
    contentPillars,
    picList,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    isManager
  } = useContentManagement();

  const [selectAll, setSelectAll] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  const [briefDialogOpen, setBriefDialogOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string>("");
  const [briefText, setBriefText] = useState("");
  
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

  const handlePICChange = (itemId: string, pic: string) => {
    updateContentItem(itemId, { pic });
  };

  const handleServiceChange = (itemId: string, service: string) => {
    // Reset subService when service changes
    updateContentItem(itemId, { 
      service,
      subService: ""
    });
  };

  const handleSubServiceChange = (itemId: string, subService: string) => {
    updateContentItem(itemId, { subService });
  };

  const handleContentPillarChange = (itemId: string, contentPillar: string) => {
    updateContentItem(itemId, { contentPillar });
  };

  const handleTitleChange = (itemId: string, title: string) => {
    updateContentItem(itemId, { title });
  }

  const handleStatusChange = (itemId: string, status: string) => {
    const item = contentItems.find(item => item.id === itemId);
    let updates: any = { status };
    
    // If status is changed to "Butuh Di Review", set completion date
    if (status === "Butuh Di Review") {
      updates.completionDate = format(new Date(), 'dd MMM yyyy - HH:mm');
    } else if (item?.completionDate && status !== "Butuh Di Review") {
      updates.completionDate = null;
    }
    
    // If status is changed to "Request Revisi", increment revision counter
    if (status === "Request Revisi" && item) {
      const currentRevisions = item.revisions || 0;
      updates.revisions = currentRevisions + 1;
    }
    
    // Reset status if brief changes
    if (item?.brief && item.status) {
      updates.status = "";
    }
    
    updateContentItem(itemId, updates);
  };

  const handleResetRevisions = (itemId: string) => {
    updateContentItem(itemId, { revisions: 0 });
    toast.success("Revision counter reset");
  };

  const handleToggleApproved = (itemId: string, approved: boolean) => {
    updateContentItem(itemId, { approved });
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
    const item = contentItems.find(item => item.id === itemId);
    setBriefText(item?.brief || "");
    setCurrentItemId(itemId);
    setBriefDialogOpen(true);
  };

  const saveBrief = () => {
    if (currentItemId) {
      updateContentItem(currentItemId, { 
        brief: briefText,
        status: "" // Reset status when brief changes
      });
      setBriefDialogOpen(false);
      toast.success("Brief updated");
    }
  };

  const getFilteredSubServices = (serviceId: string) => {
    return subServicesList.filter(subService => subService.parentId === serviceId);
  };

  return (
    <Card className="w-full">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Content Management</CardTitle>
        <div className="flex space-x-2">
          {isManager && (
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
          )}
          <Button onClick={handleAddRow} size="sm" className="text-sm">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Row
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="border rounded-md">
          <div className="overflow-hidden">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow>
                  {isManager && (
                    <TableHead className="w-[50px] min-w-[50px] text-center">
                      <Checkbox 
                        checked={selectAll} 
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                  )}
                  <TableHead className="w-[150px] min-w-[150px] text-center">Tanggal Posting</TableHead>
                  <TableHead className="w-[150px] min-w-[150px] text-center">Tipe Content</TableHead>
                  <TableHead className="w-[150px] min-w-[150px] text-center">PIC</TableHead>
                  <TableHead className="w-[150px] min-w-[150px] text-center">Layanan</TableHead>
                  <TableHead className="w-[150px] min-w-[150px] text-center">Sub Layanan</TableHead>
                  <TableHead className="w-[150px] min-w-[150px] text-center">Judul Content</TableHead>
                  <TableHead className="w-[150px] min-w-[150px] text-center">Content Pillar</TableHead>
                  <TableHead className="w-[150px] min-w-[150px] text-center">Brief</TableHead>
                  <TableHead className="w-[150px] min-w-[150px] text-center">Status</TableHead>
                  <TableHead className="w-[100px] min-w-[100px] text-center">Revision</TableHead>
                  <TableHead className="w-[100px] min-w-[100px] text-center">Approved</TableHead>
                  <TableHead className="w-[180px] min-w-[180px] text-center">Tanggal Selesai</TableHead>
                  <TableHead className="w-[150px] min-w-[150px] text-center">Tanggal Upload</TableHead>
                  <TableHead className="w-[150px] min-w-[150px] text-center">Tipe Content</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          
          <ScrollArea className="h-[400px]">
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[2000px] table-fixed">
                <TableBody>
                  {contentItems.length > 0 ? (
                    contentItems.map(item => (
                      <TableRow key={item.id}>
                        {isManager && (
                          <TableCell className="w-[50px] min-w-[50px]">
                            <Checkbox 
                              checked={item.isSelected} 
                              onCheckedChange={() => toggleSelectItem(item.id)}
                              aria-label="Select row"
                            />
                          </TableCell>
                        )}
                        <TableCell className="w-[150px] min-w-[150px]">
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
                        <TableCell className="w-[150px] min-w-[150px]">
                          <Select 
                            value={item.contentType} 
                            onValueChange={(value) => handleTypeChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-</SelectItem>
                              {contentTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[150px]">
                          <Select 
                            value={item.pic || ""} 
                            onValueChange={(value) => handlePICChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-</SelectItem>
                              {picList.map((pic) => (
                                <SelectItem key={pic.id} value={pic.id}>
                                  {pic.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[150px]">
                          <Select 
                            value={item.service || ""} 
                            onValueChange={(value) => handleServiceChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-</SelectItem>
                              {servicesList.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[150px]">
                          <Select 
                            value={item.subService || ""} 
                            onValueChange={(value) => handleSubServiceChange(item.id, value)}
                            disabled={!item.service}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-</SelectItem>
                              {item.service && getFilteredSubServices(item.service).map((subService) => (
                                <SelectItem key={subService.id} value={subService.id}>
                                  {subService.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[150px]">
                          <Input
                            value={item.title || ""}
                            onChange={(e) => handleTitleChange(item.id, e.target.value)}
                            placeholder="Enter title"
                            className="w-full"
                            maxLength={25}
                          />
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[150px]">
                          <Select 
                            value={item.contentPillar || ""} 
                            onValueChange={(value) => handleContentPillarChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-</SelectItem>
                              {contentPillars.map((pillar) => (
                                <SelectItem key={pillar.id} value={pillar.id}>
                                  {pillar.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[150px]">
                          <Button 
                            variant="ghost" 
                            onClick={() => openBriefDialog(item.id)}
                            className="w-full text-left justify-start h-10"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {item.brief ? 
                              (item.brief.length > 25 ? `${item.brief.substring(0, 22)}...` : item.brief) 
                              : "Click to add brief"}
                          </Button>
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[150px]">
                          <Select 
                            value={item.status || ""} 
                            onValueChange={(value) => handleStatusChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-</SelectItem>
                              <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
                              <SelectItem value="Request Revisi">Request Revisi</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="w-[100px] min-w-[100px] text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <span>{item.revisions || 0}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleResetRevisions(item.id)}
                              title="Reset revision counter"
                            >
                              <RefreshCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="w-[100px] min-w-[100px] text-center">
                          <Checkbox 
                            checked={item.approved || false} 
                            onCheckedChange={(checked) => handleToggleApproved(item.id, !!checked)}
                            aria-label="Approve content"
                          />
                        </TableCell>
                        <TableCell className="w-[180px] min-w-[180px]">
                          {item.status === "Butuh Di Review" && item.completionDate ? 
                            item.completionDate : ""}
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[150px]">
                          {item.postDate || ""}
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[150px]">
                          {contentTypes.find(type => type.id === item.contentType)?.name || ""}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isManager ? 15 : 14} className="h-24 text-center">
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
      
      <CardFooter className="pt-2 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {contentItems.length} item{contentItems.length !== 1 ? 's' : ''} 
          {contentItems.some(item => item.isSelected) && 
            ` (${contentItems.filter(item => item.isSelected).length} selected)`
          }
        </div>
      </CardFooter>

      <Dialog open={briefDialogOpen} onOpenChange={setBriefDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Content Brief</DialogTitle>
          </DialogHeader>
          <Textarea 
            value={briefText} 
            onChange={(e) => setBriefText(e.target.value)} 
            className="min-h-[200px]"
            placeholder="Write your content brief here..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setBriefDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveBrief}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CreateContent;
