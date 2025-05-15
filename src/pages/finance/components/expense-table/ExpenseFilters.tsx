
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

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
    <div className="space-y-3">
      <div>
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
            <SelectItem value="custom">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Custom Range
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {uniqueDepartments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueExpenseTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto">
          Export
        </Button>
      </div>
    </div>
  );
}
