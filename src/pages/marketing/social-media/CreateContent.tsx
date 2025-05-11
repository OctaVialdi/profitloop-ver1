
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
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { toast } from "sonner";
import { useContentManagement, ContentItem } from "@/hooks/useContentManagement";

const CreateContent = () => {
  const {
    contentTypes,
    contentItems,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems
  } = useContentManagement();

  const [selectAll, setSelectAll] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  
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

  const getContentTypeName = (typeId: string) => {
    const contentType = contentTypes.find(type => type.id === typeId);
    return contentType ? contentType.name : "Unknown";
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
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectAll} 
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-1/4">Tanggal Posting</TableHead>
                <TableHead>Tipe Content</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.length > 0 ? (
                contentItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No content items. Click "Add Row" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
