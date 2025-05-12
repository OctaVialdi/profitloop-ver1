
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
        {/* Add a separator between the card header and the table */}
        <Separator className="mb-2" />
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-7 whitespace-nowrap py-1 w-[90px] min-w-[90px] relative">
                PIC
                <div className="absolute right-0 top-0 h-full">
                  <Separator orientation="vertical" className="h-full bg-gray-300" />
                </div>
              </TableHead>
              <TableHead className="h-7 text-center py-1 w-[60px] relative">
                <DateSelector 
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  isCalendarOpen={isCalendarOpen}
                  setIsCalendarOpen={setIsCalendarOpen}
                  renderMonthCalendar={renderMonthCalendar}
                />
                <div className="absolute right-0 top-0 h-full">
                  <Separator orientation="vertical" className="h-full bg-gray-300" />
                </div>
              </TableHead>
              <TableHead className="h-7 text-center py-1 w-[60px] relative">
                <MonthSelector 
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  isMonthSelectorOpen={isMonthSelectorOpen}
                  setIsMonthSelectorOpen={setIsMonthSelectorOpen}
                />
                <div className="absolute right-0 top-0 h-full">
                  <Separator orientation="vertical" className="h-full bg-gray-300" />
                </div>
              </TableHead>
              <TableHead className="h-7 text-center whitespace-nowrap py-1 w-[70px] relative">
                Target {format(selectedMonth, "MMM yy")}
                <div className="absolute right-0 top-0 h-full">
                  <Separator orientation="vertical" className="h-full bg-gray-300" />
                </div>
              </TableHead>
              <TableHead className="h-7 py-1 w-[140px] relative">
                Progress
                <div className="absolute right-0 top-0 h-full">
                  <Separator orientation="vertical" className="h-full bg-gray-300" />
                </div>
              </TableHead>
              <TableHead className="h-7 text-center py-1 w-[80px] relative">
                On Time Rate
                <div className="absolute right-0 top-0 h-full">
                  <Separator orientation="vertical" className="h-full bg-gray-300" />
                </div>
              </TableHead>
              <TableHead className="h-7 text-center py-1 w-[80px] relative">
                Effective Rate
                <div className="absolute right-0 top-0 h-full">
                  <Separator orientation="vertical" className="h-full bg-gray-300" />
                </div>
              </TableHead>
              <TableHead className="h-7 text-center py-1 w-[60px]">
                Score
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentManagers.map((manager) => (
              <TableRow key={manager.name} className="hover:bg-gray-50/80">
                <TableCell className="py-1 px-2 font-medium text-sm truncate relative">
                  {manager.name}
                  <div className="absolute right-0 top-0 h-full">
                    <Separator orientation="vertical" className="h-full bg-gray-200" />
                  </div>
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm relative">
                  {manager.dailyTarget}
                  <div className="absolute right-0 top-0 h-full">
                    <Separator orientation="vertical" className="h-full bg-gray-200" />
                  </div>
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm relative">
                  {manager.monthlyTarget}
                  <div className="absolute right-0 top-0 h-full">
                    <Separator orientation="vertical" className="h-full bg-gray-200" />
                  </div>
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm relative">
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
                  <div className="absolute right-0 top-0 h-full">
                    <Separator orientation="vertical" className="h-full bg-gray-200" />
                  </div>
                </TableCell>
                <TableCell className="py-1 px-2 relative">
                  <div className="flex items-center gap-1">
                    <Progress value={manager.progress} className="h-1.5 min-w-[80px]" />
                    <span className="text-xs whitespace-nowrap">{manager.progress}%</span>
                  </div>
                  <div className="absolute right-0 top-0 h-full">
                    <Separator orientation="vertical" className="h-full bg-gray-200" />
                  </div>
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm relative">
                  {manager.onTimeRate}%
                  <div className="absolute right-0 top-0 h-full">
                    <Separator orientation="vertical" className="h-full bg-gray-200" />
                  </div>
                </TableCell>
                <TableCell className="py-1 px-2 text-center text-sm relative">
                  {manager.effectiveRate}%
                  <div className="absolute right-0 top-0 h-full">
                    <Separator orientation="vertical" className="h-full bg-gray-200" />
                  </div>
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
