
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PayrollFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PayrollFilters: React.FC<PayrollFiltersProps> = ({
  searchTerm, 
  onSearchChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="flex gap-2">
        <div className="bg-white border rounded px-2 py-1">
          <select className="border-none focus:outline-none text-sm">
            <option>All</option>
            <option>IT</option>
            <option>Marketing</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Operations</option>
          </select>
        </div>
        <div className="bg-white border rounded px-2 py-1">
          <select className="border-none focus:outline-none text-sm">
            <option>April 2025</option>
            <option>March 2025</option>
            <option>February 2025</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by Employee ID..."
          className="pl-8 pr-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
