
import React from 'react';
import { Search, Filter, ArrowDownToLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { ReprimandFilter } from '@/services/reprimandService';

interface ReprimandFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: ReprimandFilter;
  setFilters: (filters: ReprimandFilter) => void;
  exportToCSV: () => void;
}

const reprimandTypes = ["Verbal", "Written", "PIP", "Suspension"];
const statusOptions = ["Active", "Resolved", "Appealed"];
const departmentOptions = ["HR", "Finance", "IT", "Marketing", "Operations"];

const ReprimandFilters: React.FC<ReprimandFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  exportToCSV,
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  // Count active filters
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters.department && filters.department.length > 0) count++;
    if (filters.reprimand_type && filters.reprimand_type.length > 0) count++;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.startDate || filters.endDate) count++;
    return count;
  }, [filters]);

  const handleDepartmentChange = (value: string) => {
    setFilters(prev => {
      const current = prev.department || [];
      if (current.includes(value)) {
        return { ...prev, department: current.filter(item => item !== value) };
      } else {
        return { ...prev, department: [...current, value] };
      }
    });
  };

  const handleTypeChange = (value: string) => {
    setFilters(prev => {
      const current = prev.reprimand_type || [];
      if (current.includes(value)) {
        return { ...prev, reprimand_type: current.filter(item => item !== value) };
      } else {
        return { ...prev, reprimand_type: [...current, value] };
      }
    });
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => {
      const current = prev.status || [];
      if (current.includes(value)) {
        return { ...prev, status: current.filter(item => item !== value) };
      } else {
        return { ...prev, status: [...current, value] };
      }
    });
  };

  const handleDateChange = (type: 'start' | 'end', date?: Date) => {
    if (date) {
      setFilters(prev => ({
        ...prev,
        [type === 'start' ? 'startDate' : 'endDate']: date.toISOString().split('T')[0],
      }));
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
      <div className="relative w-full sm:w-auto flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reprimands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Filter Reprimands</h3>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs">Department</Label>
                <div className="grid grid-cols-2 gap-2">
                  {departmentOptions.map(dept => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`dept-${dept}`}
                        checked={(filters.department || []).includes(dept)}
                        onCheckedChange={() => handleDepartmentChange(dept)}
                      />
                      <label 
                        htmlFor={`dept-${dept}`}
                        className="text-sm cursor-pointer"
                      >
                        {dept}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Reprimand Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {reprimandTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type}`}
                        checked={(filters.reprimand_type || []).includes(type)}
                        onCheckedChange={() => handleTypeChange(type)}
                      />
                      <label 
                        htmlFor={`type-${type}`}
                        className="text-sm cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Status</Label>
                <div className="grid grid-cols-3 gap-2">
                  {statusOptions.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`status-${status}`}
                        checked={(filters.status || []).includes(status)}
                        onCheckedChange={() => handleStatusChange(status)}
                      />
                      <label 
                        htmlFor={`status-${status}`}
                        className="text-sm cursor-pointer"
                      >
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="col-span-2">
                    <CardContent className="p-2">
                      <Calendar
                        mode="range"
                        selected={{
                          from: filters.startDate ? new Date(filters.startDate) : undefined,
                          to: filters.endDate ? new Date(filters.endDate) : undefined,
                        }}
                        onSelect={(range) => {
                          if (range?.from) handleDateChange('start', range.from);
                          if (range?.to) handleDateChange('end', range.to);
                        }}
                        className="rounded-md border w-full"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={exportToCSV}>
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default ReprimandFilters;
