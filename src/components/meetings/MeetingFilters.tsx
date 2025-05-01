
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { MeetingPointFilters } from "@/types/meetings";

interface MeetingFiltersProps {
  filters: MeetingPointFilters;
  onFilterChange: (filters: MeetingPointFilters) => void;
  requestByOptions: string[];
}

export const MeetingFilters: React.FC<MeetingFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  requestByOptions 
}) => {
  return (
    <div className="flex space-x-2">
      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange({ ...filters, status: value })}
      >
        <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
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
        onValueChange={(value) => onFilterChange({ ...filters, requestBy: value })}
      >
        <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
          <SelectValue placeholder="All Request By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Request By</SelectItem>
          {requestByOptions.filter(Boolean).map((person) => (
            <SelectItem key={person} value={person}>
              {person}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={filters.timeRange}
        onValueChange={(value) => onFilterChange({ ...filters, timeRange: value })}
      >
        <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
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
  );
};
