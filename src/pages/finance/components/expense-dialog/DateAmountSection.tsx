
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DateAmountSectionProps {
  date: Date;
  setDate: (date: Date) => void;
  amount: string;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: Record<string, string>;
}

export const DateAmountSection: React.FC<DateAmountSectionProps> = ({
  date,
  setDate,
  amount,
  handleAmountChange,
  validationErrors
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Date picker */}
      <div className="space-y-2">
        <label className="text-base font-medium">
          Date<span className="text-red-500">*</span>
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal h-[50px]",
                !date && "text-muted-foreground",
                validationErrors.date && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {date ? format(date, "PPP") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                if (date) setDate(date);
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {validationErrors.date && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.date}</p>
        )}
      </div>

      {/* Amount input */}
      <div className="space-y-2">
        <label className="text-base font-medium">
          Amount (Rp)<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-[14px] text-gray-500">Rp</span>
          <Input 
            type="text"
            className={cn(
              "pl-8 h-[50px]",
              validationErrors.amount && "border-red-500"
            )}
            value={amount} 
            onChange={handleAmountChange}
            placeholder="0" 
          />
        </div>
        {validationErrors.amount && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.amount}</p>
        )}
      </div>
    </div>
  );
};
