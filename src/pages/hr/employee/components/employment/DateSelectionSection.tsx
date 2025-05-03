
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DateSelectionSectionProps {
  joinDate: Date | undefined;
  setJoinDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  signDate: Date | undefined;
  setSignDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export const DateSelectionSection: React.FC<DateSelectionSectionProps> = ({
  joinDate,
  setJoinDate,
  signDate,
  setSignDate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="joinDate">
          Join date<span className="text-red-500">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="joinDate"
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              {joinDate ? (
                format(joinDate, "dd MMM yyyy")
              ) : (
                <span className="text-gray-400">Select date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={joinDate}
              onSelect={setJoinDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signDate">Sign date</Label>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="shrink-0"
            onClick={() => setSignDate(undefined)}
          >
            <X className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="signDate"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {signDate ? (
                  format(signDate, "dd MMM yyyy")
                ) : (
                  <span className="text-gray-400">Select date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={signDate}
                onSelect={setSignDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
