
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Users, SlidersHorizontal, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ExpenseFiltersProps {
  searchTerm: string;
  dateFilter: Date | undefined;
  departmentFilter: string;
  typeFilter: string;
  uniqueDepartments: string[];
  uniqueExpenseTypes: string[];
  onSearchChange: (value: string) => void;
  onDateFilterChange: (date: Date | undefined) => void;
  onDepartmentFilterChange: (department: string) => void;
  onTypeFilterChange: (type: string) => void;
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
    <div className="flex flex-col md:flex-row items-center gap-2">
      {/* Search */}
      <div className="relative flex-grow w-full md:w-auto">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 whitespace-nowrap"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dateFilter}
            onSelect={(date) => onDateFilterChange(date)}
            initialFocus
            footer={
              <div className="flex justify-center mt-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => onDateFilterChange(undefined)}
                >
                  Clear
                </Button>
              </div>
            }
          />
        </PopoverContent>
      </Popover>

      {/* Department Filter - Fixed to not wrap text */}
      <Select
        value={departmentFilter}
        onValueChange={onDepartmentFilterChange}
      >
        <SelectTrigger className="h-10 w-[160px] overflow-hidden whitespace-nowrap text-ellipsis">
          <Users className="mr-2 h-4 w-4" />
          <span className="truncate">{departmentFilter || "All Departments"}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Departments</SelectItem>
          {uniqueDepartments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select
        value={typeFilter}
        onValueChange={onTypeFilterChange}
      >
        <SelectTrigger className="h-10 w-[144px]">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          <span className="truncate">{typeFilter || "All Types"}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Types</SelectItem>
          {uniqueExpenseTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
