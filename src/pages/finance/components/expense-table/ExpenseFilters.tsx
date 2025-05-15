
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Users, Filter } from "lucide-react";

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
  onTypeFilterChange,
}: ExpenseFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          className="pl-10" 
          placeholder="Search expenses..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-[140px] bg-white">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <SelectValue placeholder="All Time" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-time">All Time</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
          <SelectTrigger className="w-[160px] bg-white">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <SelectValue placeholder="All Departments" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {uniqueDepartments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-[140px] bg-white">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <SelectValue placeholder="All Types" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueExpenseTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
