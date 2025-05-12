
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentItem, ContentType, Service, SubService } from "@/types/contentManagement";

interface ContentBasicInfoSectionProps {
  item: ContentItem;
  contentTypes: ContentType[];
  services: Service[];
  contentPlanners: any[];
  isCalendarOpen: { [key: string]: boolean };
  toggleCalendar: (itemId: string, type: string) => void;
  handleDateChange: (itemId: string, date: Date | undefined, type: string) => void;
  handleTypeChange: (itemId: string, typeId: string) => void;
  handlePICChange: (itemId: string, picName: string) => void;
  handleServiceChange: (itemId: string, serviceId: string) => void;
  handleSubServiceChange: (itemId: string, subServiceId: string) => void;
  getFilteredSubServices: (serviceId: string) => SubService[];
  openTitleDialog: (itemId: string, currentTitle: string) => void;
}

export const ContentBasicInfoSection: React.FC<ContentBasicInfoSectionProps> = ({
  item,
  contentTypes,
  services,
  contentPlanners,
  isCalendarOpen,
  toggleCalendar,
  handleDateChange,
  handleTypeChange,
  handlePICChange,
  handleServiceChange,
  handleSubServiceChange,
  getFilteredSubServices,
  openTitleDialog,
}) => {
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
    <>
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
    </>
  );
};
