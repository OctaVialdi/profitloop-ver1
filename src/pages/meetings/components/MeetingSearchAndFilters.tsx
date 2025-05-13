
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MeetingPointFilters } from "@/types/meetings";

interface MeetingSearchAndFiltersProps {
  searchTerm: string;
  filters: MeetingPointFilters;
  onSearchChange: (value: string) => void;
  onFiltersChange: (key: keyof MeetingPointFilters, value: string) => void;
  uniqueRequestBy: string[];
}

export function MeetingSearchAndFilters({ 
  searchTerm, 
  filters, 
  onSearchChange, 
  onFiltersChange,
  uniqueRequestBy
}: MeetingSearchAndFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search discussion points..." 
            className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" 
            value={searchTerm} 
            onChange={e => onSearchChange(e.target.value)} 
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select 
            value={filters.status} 
            onValueChange={value => onFiltersChange('status', value)}
          >
            <SelectTrigger className="w-[150px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="on-going">On Going</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="presented">Presented</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.requestBy} 
            onValueChange={value => onFiltersChange('requestBy', value)}
          >
            <SelectTrigger className="w-[150px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectValue placeholder="All Request By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Request By</SelectItem>
              {uniqueRequestBy.map(person => (
                <SelectItem key={person} value={person}>{person}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.timeRange} 
            onValueChange={value => onFiltersChange('timeRange', value)}
          >
            <SelectTrigger className="w-[150px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
