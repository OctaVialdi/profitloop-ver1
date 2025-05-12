
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { format } from "date-fns";
import { DateSelector } from "./DateSelector";
import { MonthSelector } from "./MonthSelector";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentManager {
  name: string;
  dailyTarget: number;
  monthlyTarget: number;
  monthlyTargetAdjusted: number;
  progress: number;
  onTimeRate: number;
  effectiveRate: number;
  score: number;
}

interface TargetQuantityTableProps {
  contentManagers: ContentManager[];
  selectedDate: Date;
  selectedMonth: Date;
  isCalendarOpen: boolean;
  isMonthSelectorOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
  setIsMonthSelectorOpen: (isOpen: boolean) => void;
  handleEditTarget: (manager: ContentManager) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedMonth: (date: Date) => void;
  renderMonthCalendar: () => React.ReactNode;
}

export const TargetQuantityTable: React.FC<TargetQuantityTableProps> = ({
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
  renderMonthCalendar
}) => {
  return (
    <ScrollArea className="w-full">
      <div className="min-w-max">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8 w-[80px] py-1 px-1">PIC</TableHead>
              <TableHead className="h-8 text-center w-[80px] py-1 px-1">
                <DateSelector 
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  isCalendarOpen={isCalendarOpen}
                  setIsCalendarOpen={setIsCalendarOpen}
                  renderMonthCalendar={renderMonthCalendar}
                />
              </TableHead>
              <TableHead className="h-8 text-center w-[80px] py-1 px-1">
                <MonthSelector 
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  isMonthSelectorOpen={isMonthSelectorOpen}
                  setIsMonthSelectorOpen={setIsMonthSelectorOpen}
                />
              </TableHead>
              <TableHead className="h-8 text-center w-[80px] py-1 px-1">
                Target {format(selectedMonth, "MMM yyyy")}
              </TableHead>
              <TableHead className="h-8 w-[80px] py-1 px-1">Progress</TableHead>
              <TableHead className="h-8 text-center w-[80px] py-1 px-1">On Time Rate</TableHead>
              <TableHead className="h-8 text-center w-[80px] py-1 px-1">Effective Rate</TableHead>
              <TableHead className="h-8 text-center w-[80px] py-1 px-1">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentManagers.map((manager) => (
              <TableRow key={manager.name} className="hover:bg-gray-50/80">
                <TableCell className="py-1 px-1 font-medium text-xs">{manager.name}</TableCell>
                <TableCell className="py-1 px-1 text-center text-xs">{manager.dailyTarget}</TableCell>
                <TableCell className="py-1 px-1 text-center text-xs">{manager.monthlyTarget}</TableCell>
                <TableCell className="py-1 px-1 text-center text-xs">
                  <div className="flex items-center justify-center gap-0.5">
                    <span>{manager.monthlyTargetAdjusted}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4"
                      onClick={() => handleEditTarget(manager)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="py-1 px-1">
                  <div className="flex items-center gap-0.5">
                    <Progress value={manager.progress} className="h-1.5" />
                    <span className="text-xs">{manager.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="py-1 px-1 text-center text-xs">{manager.onTimeRate}%</TableCell>
                <TableCell className="py-1 px-1 text-center text-xs">{manager.effectiveRate}%</TableCell>
                <TableCell className="py-1 px-1 text-center text-xs">{manager.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};
