
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type DateRangeType = {
  from: Date;
  to: Date;
};

export type PresetOption = {
  label: string;
  value: string;
  dateRange: () => DateRangeType;
};

interface DashboardFilterProps {
  onRangeChange: (range: DateRangeType) => void;
  initialRange?: DateRangeType;
}

export function DashboardFilter({ onRangeChange, initialRange }: DashboardFilterProps) {
  const today = new Date();
  
  const presets: PresetOption[] = [
    {
      label: 'Last 7 days',
      value: 'last-7',
      dateRange: () => ({
        from: subDays(today, 7),
        to: today,
      }),
    },
    {
      label: 'Last 30 days',
      value: 'last-30',
      dateRange: () => ({
        from: subDays(today, 30),
        to: today,
      }),
    },
    {
      label: 'Current Month',
      value: 'current-month',
      dateRange: () => ({
        from: startOfMonth(today),
        to: endOfMonth(today),
      }),
    },
    {
      label: 'Last Month',
      value: 'last-month',
      dateRange: () => {
        const lastMonth = subMonths(today, 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        };
      },
    },
    {
      label: 'Year to Date',
      value: 'ytd',
      dateRange: () => ({
        from: startOfYear(today),
        to: today,
      }),
    },
  ];

  const [date, setDate] = useState<DateRangeType>(
    initialRange || {
      from: subDays(today, 30), // Default to last 30 days
      to: today,
    }
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'date' | 'month'>('date');

  // Apply the selected date range
  const applyDateRange = (range: DateRangeType) => {
    const normalizedRange = {
      from: startOfDay(range.from),
      to: endOfDay(range.to),
    };
    
    setDate(normalizedRange);
    onRangeChange(normalizedRange);
    setIsOpen(false);
  };

  // Apply a preset
  const applyPreset = (preset: PresetOption) => {
    setActivePreset(preset.value);
    const range = preset.dateRange();
    applyDateRange(range);
  };

  // Load from localStorage on initial render
  useEffect(() => {
    const savedRange = localStorage.getItem('dashboard-date-range');
    if (savedRange) {
      try {
        const parsedRange = JSON.parse(savedRange);
        setDate({
          from: new Date(parsedRange.from),
          to: new Date(parsedRange.to),
        });
      } catch (e) {
        console.error('Failed to parse saved date range:', e);
      }
    }
  }, []);

  // Save to localStorage when date changes
  useEffect(() => {
    localStorage.setItem('dashboard-date-range', JSON.stringify({
      from: date.from.toISOString(),
      to: date.to.toISOString(),
    }));
    
    onRangeChange(date);
  }, [date, onRangeChange]);

  let buttonText = '';
  if (activePreset) {
    const preset = presets.find(p => p.value === activePreset);
    buttonText = preset ? preset.label : '';
  } else {
    buttonText = `${format(date.from, 'dd MMM yyyy')} - ${format(date.to, 'dd MMM yyyy')}`;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-sm w-full sm:w-[240px]"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {buttonText}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 pb-0">
            <Tabs
              defaultValue="date"
              value={filterMode}
              onValueChange={(value) => setFilterMode(value as 'date' | 'month')}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="date">Date Range</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="p-4 pt-2 flex gap-2">
            <div className="flex flex-col gap-2">
              <div className="space-y-2 text-xs">
                {presets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={activePreset === preset.value ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start font-normal"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="border-l border-gray-200 dark:border-gray-800" />
            <div className="flex flex-col gap-2">
              <Calendar
                mode="range"
                selected={{
                  from: date.from,
                  to: date.to,
                }}
                onSelect={(selected) => {
                  if (selected?.from && selected?.to) {
                    setActivePreset(null);
                    applyDateRange(selected as DateRangeType);
                  }
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 pt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                applyDateRange(date);
              }}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
