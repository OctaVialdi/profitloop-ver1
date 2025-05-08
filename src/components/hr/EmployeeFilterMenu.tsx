
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, CalendarIcon } from "lucide-react";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

// Define filter options
const STATUS_OPTIONS = ['Active', 'Inactive', 'Resigned'];
const EMPLOYMENT_STATUS_OPTIONS = ['Permanent', 'Contract', 'Probation', 'Internship'];

interface EmployeeFilterMenuProps {
  onClose: () => void;
  activeFilters: Record<string, string[]>;
  setActiveFilters: (filters: Record<string, string[]>) => void;
}

export const EmployeeFilterMenu: React.FC<EmployeeFilterMenuProps> = ({ onClose, activeFilters, setActiveFilters }) => {
  // Date filter state
  const [joinDateRange, setJoinDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters({
      ...activeFilters,
      [key]: activeFilters[key]?.includes(value)
        ? activeFilters[key].filter(v => v !== value)
        : [...(activeFilters[key] || []), value]
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setJoinDateRange({ from: undefined, to: undefined });
  };

  const applyDateFilter = () => {
    if (joinDateRange.from) {
      const newFilters = { ...activeFilters };
      
      if (joinDateRange.from) {
        newFilters['joinDateFrom'] = [format(joinDateRange.from, 'yyyy-MM-dd')];
      }
      
      if (joinDateRange.to) {
        newFilters['joinDateTo'] = [format(joinDateRange.to, 'yyyy-MM-dd')];
      }
      
      setActiveFilters(newFilters);
    }
  };

  const clearDateFilter = () => {
    setJoinDateRange({ from: undefined, to: undefined });
    
    const newFilters = { ...activeFilters };
    delete newFilters['joinDateFrom'];
    delete newFilters['joinDateTo'];
    setActiveFilters(newFilters);
  };

  const renderCheckbox = (key: string, value: string, label: string) => {
    const isChecked = activeFilters[key]?.includes(value) || false;
    
    return (
      <div className="flex items-center space-x-2">
        <Checkbox 
          id={`${key}-${value}`} 
          checked={isChecked}
          onCheckedChange={() => handleFilterChange(key, value)}
        />
        <label 
          htmlFor={`${key}-${value}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      </div>
    );
  };

  return (
    <div className="p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Filter</h3>
        {Object.keys(activeFilters).length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Status filter */}
      <div className="space-y-2 mb-6">
        <Label className="font-medium">Status</Label>
        <div className="grid grid-cols-2 gap-2">
          {renderCheckbox('status', 'All', 'All')}
          {STATUS_OPTIONS.map(status => (
            renderCheckbox('status', status, status)
          ))}
        </div>
      </div>

      {/* Employment status filter */}
      <div className="space-y-2 mb-6">
        <Label className="font-medium">Employment Status</Label>
        <div className="grid grid-cols-2 gap-2">
          {renderCheckbox('employmentStatus', 'All', 'All')}
          {EMPLOYMENT_STATUS_OPTIONS.map(status => (
            renderCheckbox('employmentStatus', status, status)
          ))}
        </div>
      </div>

      {/* Join date filter */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <Label className="font-medium">Join Date</Label>
          {(joinDateRange.from || joinDateRange.to) && (
            <Button variant="ghost" size="sm" onClick={clearDateFilter}>
              Clear
            </Button>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !joinDateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {joinDateRange.from ? (
                joinDateRange.to ? (
                  <>
                    {format(joinDateRange.from, "PPP")} - {format(joinDateRange.to, "PPP")}
                  </>
                ) : (
                  format(joinDateRange.from, "PPP")
                )
              ) : (
                "Select join date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={joinDateRange.from}
              selected={joinDateRange}
              onSelect={setJoinDateRange}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
            <div className="flex justify-end gap-2 p-2 border-t">
              <Button variant="outline" size="sm" onClick={clearDateFilter}>
                Clear
              </Button>
              <Button size="sm" onClick={applyDateFilter}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2 mb-6">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandList className="h-52">
            <CommandEmpty>No branches found.</CommandEmpty>
            <CommandGroup heading="Branches">
              <CommandItem className="flex items-center">
                <Checkbox id="branch-all" className="mr-2" />
                <label htmlFor="branch-all" className="flex-1 cursor-pointer">All Branches</label>
              </CommandItem>
              <CommandItem className="flex items-center">
                <Checkbox id="branch-jakarta" className="mr-2" />
                <label htmlFor="branch-jakarta" className="flex-1 cursor-pointer">Jakarta</label>
              </CommandItem>
              <CommandItem className="flex items-center">
                <Checkbox id="branch-surabaya" className="mr-2" />
                <label htmlFor="branch-surabaya" className="flex-1 cursor-pointer">Surabaya</label>
              </CommandItem>
              <CommandItem className="flex items-center">
                <Checkbox id="branch-bandung" className="mr-2" />
                <label htmlFor="branch-bandung" className="flex-1 cursor-pointer">Bandung</label>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      <Button className="w-full" onClick={onClose}>
        Apply Filters
      </Button>
    </div>
  );
};
