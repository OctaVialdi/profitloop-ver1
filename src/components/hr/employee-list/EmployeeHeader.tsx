import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
export const EmployeeHeader: React.FC = () => {
  return <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Employee list</h2>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              More <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export data</DropdownMenuItem>
            <DropdownMenuItem>Print list</DropdownMenuItem>
            <DropdownMenuItem>Archive employees</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        
        
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-1">
              Add employee <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/hr/data/add-employee">Add employee</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Import employee</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>;
};