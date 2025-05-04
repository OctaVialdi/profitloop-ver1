
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmployeeActionsProps {
  employeeId: string;
  employeeName: string;
}

export const EmployeeActions: React.FC<EmployeeActionsProps> = ({ employeeId, employeeName }) => {
  const navigate = useNavigate();
  
  const handleViewInfo = () => {
    navigate(`/my-info/personal?id=${employeeId}`);
  };
  
  const handleResign = () => {
    console.log(`Resign employee: ${employeeId}`);
  };
  
  const handleDelete = () => {
    console.log(`Delete employee: ${employeeId}`);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-1">
          Actions <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleViewInfo}>
          View employee's info
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleResign}>
          Resign
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-gray-400"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
