
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpenseFiltersProps {
  searchTerm: string;
  dateFilter: string;
  departmentFilter: string;
  typeFilter: string;
  uniqueDepartments: string[];
  uniqueExpenseTypes: string[];
  onSearchChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onDepartmentFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

export function ExpenseFilters({
  searchTerm,
  dateFilter,
  departmentFilter,
  typeFilter,
  uniqueDepartments,
  uniqueExpenseTypes,
  onSearchChange,
  onDateFilterChange,
  onDepartmentFilterChange,
  onTypeFilterChange
}: ExpenseFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="w-full lg:w-2/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            className="pl-10 text-sm border-gray-200"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 w-full lg:w-3/5">
        <div className="flex gap-2 items-center">
          <Filter className="text-gray-400" size={16} />
          <span className="text-sm text-gray-500">Filter:</span>
        </div>
        
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="h-9 text-xs w-[110px] bg-white border-gray-200">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
          <SelectTrigger className="h-9 text-xs w-[130px] bg-white border-gray-200">
            <SelectValue placeholder="Department" className="whitespace-nowrap" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            <SelectItem value="all" className="whitespace-nowrap">All Departments</SelectItem>
            {uniqueDepartments.map(department => (
              <SelectItem 
                key={department} 
                value={department}
                className="whitespace-nowrap"
              >
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="h-9 text-xs w-[110px] bg-white border-gray-200">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueExpenseTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
