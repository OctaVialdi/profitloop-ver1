
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface EmployeeSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const EmployeeSearchBar: React.FC<EmployeeSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search employees by name, ID, email..."
        className="pl-10 py-2 h-9 text-sm border-muted focus:border-primary"
      />
    </div>
  );
};
