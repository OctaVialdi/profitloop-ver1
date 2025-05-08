
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { EmployeeFilterMenu } from "../EmployeeFilterMenu";
import { EmployeeColumnManager, EmployeeColumnState, ColumnOrder } from "../EmployeeColumnManager";

interface EmployeeFiltersProps {
  showFilter: boolean;
  setShowFilter: (value: boolean) => void;
  showColumns: boolean;
  setShowColumns: (value: boolean) => void;
  visibleColumns: EmployeeColumnState;
  setVisibleColumns: (columns: EmployeeColumnState) => void;
  columnOrder: ColumnOrder;
  setColumnOrder: (order: ColumnOrder) => void;
  activeFilters: Record<string, string[]>;
  setActiveFilters: (filters: Record<string, string[]>) => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  showFilter,
  setShowFilter,
  showColumns,
  setShowColumns,
  visibleColumns,
  setVisibleColumns,
  columnOrder,
  setColumnOrder,
  activeFilters,
  setActiveFilters
}) => {
  // Count the number of active filters (excluding entries with empty arrays)
  const activeFilterCount = Object.entries(activeFilters)
    .filter(([_, values]) => values.length > 0 && !values.includes('All'))
    .length;
    
  const filterButtonText = activeFilterCount > 0 
    ? `Filter (${activeFilterCount})` 
    : "Filter";
  
  return (
    <div className="flex items-center justify-between gap-4">
      <Popover open={showFilter} onOpenChange={setShowFilter}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between text-sm">
            {filterButtonText} <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <EmployeeFilterMenu 
            onClose={() => setShowFilter(false)} 
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />
        </PopoverContent>
      </Popover>

      <div className="flex-1 flex items-center justify-end gap-2">
        <Popover open={showColumns} onOpenChange={setShowColumns}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="end">
            <EmployeeColumnManager 
              columns={visibleColumns} 
              onColumnChange={newColumns => setVisibleColumns(newColumns)} 
              columnOrder={columnOrder} 
              onOrderChange={newOrder => setColumnOrder(newOrder)} 
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
