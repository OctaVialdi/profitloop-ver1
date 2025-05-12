
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface MonthSelectorProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  isMonthSelectorOpen: boolean;
  setIsMonthSelectorOpen: (isOpen: boolean) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  setSelectedMonth,
  isMonthSelectorOpen,
  setIsMonthSelectorOpen
}) => {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <DropdownMenu 
      open={isMonthSelectorOpen} 
      onOpenChange={setIsMonthSelectorOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center justify-center gap-1 w-full font-normal text-xs h-7 px-2"
        >
          <span>{format(selectedMonth, "MMMM yyyy")}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
        {months.map((month, index) => {
          const isCurrentYear = new Date().getFullYear() === selectedMonth.getFullYear();
          const isCurrentMonth = index === selectedMonth.getMonth() && isCurrentYear;
          
          return (
            <DropdownMenuItem
              key={month}
              className={`flex items-center py-1 px-4 text-xs ${isCurrentMonth ? 'bg-gray-100' : ''}`}
              onClick={() => {
                setSelectedMonth(new Date(selectedMonth.getFullYear(), index));
                setIsMonthSelectorOpen(false);
              }}
            >
              {isCurrentMonth && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3 w-3 mr-2 text-blue-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
              {month} {selectedMonth.getFullYear()}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
