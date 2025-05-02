
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { EmployeeFilterMenu } from "../EmployeeFilterMenu";
import { EmployeeColumnManager, EmployeeColumnState } from "../EmployeeColumnManager";
import { ColumnKey } from './types';

interface EmployeeFiltersProps {
  showFilter: boolean;
  setShowFilter: (value: boolean) => void;
  showColumns: boolean;
  setShowColumns: (value: boolean) => void;
  visibleColumns: EmployeeColumnState;
  setVisibleColumns: (columns: EmployeeColumnState) => void;
  columnOrder: ColumnKey[];
  setColumnOrder: (order: ColumnKey[]) => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  showFilter,
  setShowFilter,
  showColumns,
  setShowColumns,
  visibleColumns,
  setVisibleColumns,
  columnOrder,
  setColumnOrder
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <Popover open={showFilter} onOpenChange={setShowFilter}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between text-sm">
            Filter (1) <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <EmployeeFilterMenu onClose={() => setShowFilter(false)} />
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
              onColumnChange={(newColumns) => setVisibleColumns(newColumns)} 
              columnOrder={columnOrder}
              onColumnOrderChange={setColumnOrder}
            />
          </PopoverContent>
        </Popover>
        
        <Button variant="ghost" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-table-properties"><path d="M15 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M21 9H3"/><path d="M21 15H3"/></svg>
        </Button>
      </div>
    </div>
  );
};
