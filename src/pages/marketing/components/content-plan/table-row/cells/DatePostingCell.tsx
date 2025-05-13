
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TableCell } from "@/components/ui/table";

interface DatePostingCellProps {
  id: string;
  date: string | null;
  onDateChange: (id: string, date: Date | undefined) => void;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
}

export default function DatePostingCell({ 
  id, 
  date, 
  onDateChange, 
  formatDisplayDate 
}: DatePostingCellProps) {
  return (
    <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full h-8">
            {date ? formatDisplayDate(date) : "Select date"}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar 
            mode="single" 
            selected={date ? new Date(date) : undefined} 
            onSelect={selectedDate => onDateChange(id, selectedDate)} 
            initialFocus 
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </TableCell>
  );
}
