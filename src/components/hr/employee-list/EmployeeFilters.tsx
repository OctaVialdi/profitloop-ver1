
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EmployeeFilterMenu } from "../EmployeeFilterMenu";
import { EmployeeColumnManager, EmployeeColumnState, EmployeeColumnOrder } from "../EmployeeColumnManager";
import { SlidersHorizontal, Columns } from "lucide-react";

interface EmployeeFiltersProps {
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  showColumns: boolean;
  setShowColumns: (show: boolean) => void;
  visibleColumns: EmployeeColumnState;
  setVisibleColumns: (columns: EmployeeColumnState) => void;
  columnOrder: EmployeeColumnOrder;
  setColumnOrder: (order: EmployeeColumnOrder) => void;
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
    <div className="flex items-center space-x-2">
      <Popover open={showFilter} onOpenChange={setShowFilter}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-normal"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <EmployeeFilterMenu />
        </PopoverContent>
      </Popover>

      <Popover open={showColumns} onOpenChange={setShowColumns}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-normal"
          >
            <Columns className="h-4 w-4 mr-2" />
            Columns
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <EmployeeColumnManager
            columns={visibleColumns}
            onColumnChange={setVisibleColumns}
            columnOrder={columnOrder}
            onColumnOrderChange={setColumnOrder}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
