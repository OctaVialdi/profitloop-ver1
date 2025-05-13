
import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ContentManagersTable from "./ContentManagersTable";
import MonthCalendar from "./MonthCalendar";
import { ContentManager } from "../../types/socialMedia";

interface ContentPlannerTabProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedMonth: Date;
  setSelectedMonth: (month: Date) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
  isMonthSelectorOpen: boolean;
  setIsMonthSelectorOpen: (isOpen: boolean) => void;
  contentManagers: ContentManager[];
  handleEditTarget: (manager: ContentManager) => void;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
}

const ContentPlannerTab: React.FC<ContentPlannerTabProps> = ({
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  isCalendarOpen,
  setIsCalendarOpen,
  isMonthSelectorOpen,
  setIsMonthSelectorOpen,
  contentManagers,
  handleEditTarget,
  handlePreviousMonth,
  handleNextMonth
}) => {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-lg">Target Quantity Content Planner</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[500px]">
          <div className="overflow-x-auto">
            <ContentManagersTable 
              contentManagers={contentManagers} 
              handleEditTarget={handleEditTarget}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ContentPlannerTab;
