
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateSelectorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
  renderMonthCalendar: () => React.ReactNode;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  isCalendarOpen,
  setIsCalendarOpen,
  renderMonthCalendar
}) => {
  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center justify-center gap-1 w-full font-normal text-xs h-6 px-1"
        >
          <span className="truncate">{format(selectedDate, "dd MMM yyyy")}</span>
          <CalendarIcon className="h-3 w-3 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {renderMonthCalendar()}
      </PopoverContent>
    </Popover>
  );
};
