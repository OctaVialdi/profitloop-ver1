
import React from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { recurringFrequencies } from "./constants";

interface RecurringSectionProps {
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  recurringFrequency: string;
  setRecurringFrequency: (value: string) => void;
  validationErrors: Record<string, string>;
}

export const RecurringSection: React.FC<RecurringSectionProps> = ({
  isRecurring,
  setIsRecurring,
  recurringFrequency,
  setRecurringFrequency,
  validationErrors
}) => {
  return (
    <>
      {/* Recurring Expense */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="recurring" 
            className="h-5 w-5 data-[state=checked]:bg-[#8B5CF6]" 
            checked={isRecurring} 
            onCheckedChange={(checked) => setIsRecurring(checked as boolean)} 
          />
          <label 
            htmlFor="recurring" 
            className="text-base font-medium leading-none cursor-pointer"
          >
            Recurring Expense
          </label>
        </div>
        <p className="text-sm text-muted-foreground">This expense repeats at regular intervals</p>
      </div>

      {/* Recurring Frequency - only show when recurring is checked */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-base font-medium">
            Recurring Frequency<span className="text-red-500">*</span>
          </label>
          <Select 
            value={recurringFrequency} 
            onValueChange={(value) => setRecurringFrequency(value)}
          >
            <SelectTrigger className={cn(
              "h-[50px]",
              validationErrors.recurringFrequency && "border-red-500"
            )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {recurringFrequencies.map((freq) => (
                <SelectItem key={freq} value={freq}>{freq}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.recurringFrequency && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.recurringFrequency}</p>
          )}
        </div>
      )}
    </>
  );
};
