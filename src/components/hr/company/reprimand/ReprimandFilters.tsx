
import React from 'react';
import { Search, Filter, Download, CalendarIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReprimandFilter } from '@/services/reprimandService';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReprimandFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: ReprimandFilter;
  setFilters: (filters: ReprimandFilter) => void;
  exportToCSV: () => void;
}

const ReprimandFilters: React.FC<ReprimandFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  exportToCSV
}) => {
  const reprimandTypes = ['All', 'Verbal', 'Written', 'PIP', 'Final Warning'];
  const statusOptions = ['All', 'Active', 'Resolved', 'Appealed'];

  const handleFilterChange = (type: keyof ReprimandFilter, value: string) => {
    if (value === 'All') {
      // If 'All' is selected, clear the filter for this type
      const newFilters = { ...filters };
      if (type === 'reprimand_type') {
        newFilters.reprimand_type = ['All'];
      } else if (type === 'status') {
        newFilters.status = ['All'];
      }
      setFilters(newFilters);
    } else {
      // Update the specific filter
      setFilters({
        ...filters,
        [type]: [value]
      });
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setFilters({
      ...filters,
      startDate: date ? format(date, 'yyyy-MM-dd') : undefined
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setFilters({
      ...filters,
      endDate: date ? format(date, 'yyyy-MM-dd') : undefined
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10"
          placeholder="Search by employee name, department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Select 
        value={filters.reprimand_type?.[0] || 'All'} 
        onValueChange={(value) => handleFilterChange('reprimand_type', value)}
      >
        <SelectTrigger className="w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Reprimand Type" />
        </SelectTrigger>
        <SelectContent>
          {reprimandTypes.map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={filters.status?.[0] || 'All'} 
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(status => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn(
              "justify-start text-left font-normal",
              !filters.startDate && "text-muted-foreground"
            )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? format(new Date(filters.startDate), 'PP') : <span>Start Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.startDate ? new Date(filters.startDate) : undefined}
              onSelect={handleStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn(
              "justify-start text-left font-normal",
              !filters.endDate && "text-muted-foreground"
            )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? format(new Date(filters.endDate), 'PP') : <span>End Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.endDate ? new Date(filters.endDate) : undefined}
              onSelect={handleEndDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button variant="outline" onClick={exportToCSV}>
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
    </div>
  );
};

export default ReprimandFilters;
