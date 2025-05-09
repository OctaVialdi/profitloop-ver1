import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  SlidersHorizontal,
  Columns,
  X
} from 'lucide-react';
import { EmployeeColumnState, ColumnOrder } from '../EmployeeColumnManager';

interface EmployeeFiltersProps {
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  showColumns: boolean;
  setShowColumns: (show: boolean) => void;
  visibleColumns: EmployeeColumnState;
  setVisibleColumns: (columns: EmployeeColumnState) => void;
  columnOrder: ColumnOrder;
  setColumnOrder: (columns: ColumnOrder) => void;
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
  setActiveFilters,
}) => {
  const countActiveFilters = () => {
    let count = 0;
    for (const key in activeFilters) {
      count += activeFilters[key].filter(val => val !== 'All').length;
    }
    return count;
  };
  
  const activeFilterCount = countActiveFilters();
  
  const handleRemoveFilter = (key: string, value: string) => {
    const newFilters = { ...activeFilters };
    newFilters[key] = newFilters[key].filter(v => v !== value);
    if (newFilters[key].length === 0) {
      delete newFilters[key];
    }
    setActiveFilters(newFilters);
  };
  
  const handleClearAllFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={showFilter} onOpenChange={setShowFilter}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-9 flex items-center gap-1.5 ${activeFilterCount > 0 ? 'border-primary/50 bg-primary/5' : ''}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 px-1.5 bg-primary text-primary-foreground">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-0">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Filter Employees</h3>
              {activeFilterCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleClearAllFilters}
                >
                  Clear all
                </Button>
              )}
            </div>
            
            {/* Filter content will go here, keeping it minimal for now */}
            <p className="text-sm text-muted-foreground">Filter by status, department, position, etc.</p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={showColumns} onOpenChange={setShowColumns}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 flex items-center gap-1.5"
          >
            <Columns className="h-3.5 w-3.5" />
            <span>Columns</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-0">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-medium mb-2">Column Visibility</h3>
            <p className="text-sm text-muted-foreground">Select columns to display in the table</p>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5 ml-1">
          {Object.entries(activeFilters).map(([key, values]) => 
            values.filter(v => v !== 'All').map(value => (
              <Badge 
                key={`${key}-${value}`} 
                variant="outline" 
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50"
              >
                {key}: {value}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveFilter(key, value)} 
                />
              </Badge>
            ))
          )}
        </div>
      )}
    </div>
  );
};
