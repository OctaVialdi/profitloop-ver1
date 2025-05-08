
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/hooks/useEmployees';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface EmployeeActionsProps {
  employeeId: string;
  employeeName: string;
}

export const EmployeeActions: React.FC<EmployeeActionsProps> = ({ employeeId, employeeName }) => {
  const navigate = useNavigate();
  const { resignEmployee, deleteEmployee } = useEmployees();
  
  const handleViewInfo = () => {
    // Changed route from /hr/my-info/personal/{id} to /my-info/personal?id={id}
    navigate(`/my-info/personal?id=${employeeId}`);
  };
  
  const handleResign = async () => {
    try {
      // Update employee status to "Resigned" in both tables
      const success = await resignEmployee(employeeId);
      
      if (success) {
        toast.success(`Employee ${employeeName} has been marked as resigned`);
      } else {
        toast.error("Failed to resign employee");
      }
    } catch (error) {
      console.error(`Error resigning employee: ${employeeId}`, error);
      toast.error("Failed to resign employee");
    }
  };
  
  const handleDelete = async () => {
    try {
      // Delete employee from database
      await deleteEmployee(employeeId);
      toast.success(`Employee ${employeeName} has been deleted`);
    } catch (error) {
      console.error(`Error deleting employee: ${employeeId}`, error);
      toast.error("Failed to delete employee");
    }
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
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Resign
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resign Employee</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark {employeeName} as resigned? This will update their status in the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResign}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem 
              onSelect={(e) => e.preventDefault()}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Employee</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {employeeName}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
