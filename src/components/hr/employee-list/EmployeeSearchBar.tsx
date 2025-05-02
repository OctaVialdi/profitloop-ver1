
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EmployeeSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const EmployeeSearchBar: React.FC<EmployeeSearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input 
        className="pl-10 w-[300px] text-sm" 
        placeholder="Search..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
