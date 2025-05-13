
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TargetQuantityTable } from "./TargetQuantityTable";

interface TargetQuantityCardProps {
  contentManagers: any[];
  selectedDate: Date;
  selectedMonth: Date;
  isCalendarOpen: boolean;
  isMonthSelectorOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
  setIsMonthSelectorOpen: (isOpen: boolean) => void;
  handleEditTarget: (manager: any) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedMonth: (date: Date) => void;
  renderMonthCalendar: () => React.ReactNode;
  activeTab: string;
}

export const TargetQuantityCard: React.FC<TargetQuantityCardProps> = ({
  contentManagers,
  selectedDate,
  selectedMonth,
  isCalendarOpen,
  isMonthSelectorOpen,
  setIsCalendarOpen,
  setIsMonthSelectorOpen,
  handleEditTarget,
  setSelectedDate,
  setSelectedMonth,
  renderMonthCalendar,
  activeTab
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case "content-planner":
        return "Target Quantity Content Planner";
      case "production":
        return "Target Quantity Production Team";
      case "content-post":
        return "Target Quantity Post Content";
      default:
        return "Target Quantity";
    }
  };

  return (
    <Card className="w-full border shadow-sm mb-4">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-lg">{getTabTitle()}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <TargetQuantityTable 
          contentManagers={contentManagers}
          selectedDate={selectedDate}
          selectedMonth={selectedMonth}
          isCalendarOpen={isCalendarOpen}
          isMonthSelectorOpen={isMonthSelectorOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          setIsMonthSelectorOpen={setIsMonthSelectorOpen}
          handleEditTarget={handleEditTarget}
          setSelectedDate={setSelectedDate}
          setSelectedMonth={setSelectedMonth}
          renderMonthCalendar={renderMonthCalendar}
        />
      </CardContent>
    </Card>
  );
};
