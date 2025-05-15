
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ExpenseFiltersProps {
  searchTerm: string;
  dateFilter: Date | null;
  departmentFilter: string;
  typeFilter: string;
  uniqueDepartments: string[];
  uniqueExpenseTypes: string[];
  onSearchChange: (value: string) => void;
  onDateFilterChange: (value: Date | null) => void;
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
    <div className="flex flex-col md:flex-row gap-3">
      {/* Search Input */}
      <div className="flex-1">
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left h-10 w-full md:max-w-[180px]",
              !dateFilter && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateFilter || undefined}
            onSelect={onDateFilterChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {/* Department Filter */}
      <Select
        value={departmentFilter}
        onValueChange={onDepartmentFilterChange}
      >
        <SelectTrigger className="h-10 w-full md:w-[180px] whitespace-nowrap overflow-hidden">
          <SelectValue placeholder="All Departments" />
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
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="h-10 w-full md:w-[180px]">
          <SelectValue placeholder="All Types" />
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
