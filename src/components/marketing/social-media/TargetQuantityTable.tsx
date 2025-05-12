
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
import { Separator } from "@/components/ui/separator";

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
      <div className="min-w-fit">
        {/* Horizontal separator between card header and table */}
        <Separator className="mb-2" />
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-7 whitespace-nowrap py-1 w-[90px] min-w-[90px] relative border-r border-gray-300">
                PIC
              </TableHead>
              <TableHead className="h-7 text-center py-1 w-[60px] relative border-r border-gray-300">
                <DateSelector 
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  isCalendarOpen={isCalendarOpen}
                  setIsCalendarOpen={setIsCalendarOpen}
                  renderMonthCalendar={renderMonthCalendar}
                />
              </TableHead>
              <TableHead className="h-7 text-center py-1 w-[60px] relative border-r border-gray-300">
                <MonthSelector 
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  isMonthSelectorOpen={isMonthSelectorOpen}
                  setIsMonthSelectorOpen={setIsMonthSelectorOpen}
                />
              </TableHead>
              <TableHead className="h-7 text-center whitespace-nowrap py-1 w-[70px] relative border-r border-gray-300">
                Target {format(selectedMonth, "MMM yy")}
              </TableHead>
              <TableHead className="h-7 py-1 w-[140px] relative border-r border-gray-300">
                Progress
              </TableHead>
              <TableHead className="h-7 text-center py-1 w-[80px] relative border-r border-gray-300">
                On Time Rate
              </TableHead>
              <TableHead className="h-7 text-center py-1 w-[80px] relative border-r border-gray-300">
                Effective Rate
              </TableHead>
              <TableHead className="h-7 text-center py-1 w-[60px]">
                Score
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentManagers.map((manager) => (
              <TableRow key={manager.name} className="hover:bg-gray-50/80">
                <TableCell className="py-1 px-2 font-medium text-sm truncate border-r border-gray-200">
                  {manager.name}
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm border-r border-gray-200">
                  {manager.dailyTarget}
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm border-r border-gray-200">
                  {manager.monthlyTarget}
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm border-r border-gray-200">
                  <div className="flex items-center justify-center gap-1">
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
                <TableCell className="py-1 px-2 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    <Progress value={manager.progress} className="h-1.5 min-w-[80px]" />
                    <span className="text-xs whitespace-nowrap">{manager.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm border-r border-gray-200">
                  {manager.onTimeRate}%
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm border-r border-gray-200">
                  {manager.effectiveRate}%
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm">
                  {manager.score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};
