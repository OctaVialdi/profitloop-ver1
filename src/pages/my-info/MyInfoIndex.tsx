
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { EmployeeWithDetails, employeeService } from "@/services/employeeService";
import { EmployeeDetail } from "@/components/hr/EmployeeDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function MyInfoIndex() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract the employee ID from the query parameters
  const employeeId = searchParams.get("id");
  
  // Get the active tab from the path
  const path = location.pathname.split('/');
  const currentPath = path[path.length - 1];
  
  // Map path to tab value
  const getTabFromPath = (path: string) => {
    switch(path) {
      case 'personal': return 'personal';
      case 'employment': return 'employment';
      case 'education': return 'education';
      case 'files': return 'files';
      case 'assets': return 'assets';
      case 'attendance': return 'attendance';
      case 'schedule': return 'schedule';
      case 'time-off': return 'time-off';
      case 'payroll-info': return 'payroll-info';
      case 'reimbursement': return 'reimbursement';
      case 'cash-advance': return 'cash-advance';
      case 'loan': return 'loan';
      case 'adjustment': return 'adjustment';
      case 'transfer': return 'transfer';
      case 'npp': return 'npp';
      case 'reprimand': return 'reprimand';
      case 'index': return 'personal'; // Default to personal if at index route
      default: return path;
    }
  };
  
  const activeTab = getTabFromPath(currentPath);
  
  const [employee, setEmployee] = useState<EmployeeWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!employeeId) return;
      
      setLoading(true);
      try {
        const data = await employeeService.fetchEmployeeById(employeeId);
        setEmployee(data);
        if (!data) {
          toast.error("Employee not found");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployee();
  }, [employeeId]);

  // Redirect to personal route if at index
  useEffect(() => {
    if (currentPath === 'index' && employeeId) {
      navigate(`/my-info/personal?id=${employeeId}`, { replace: true });
    }
  }, [currentPath, employeeId, navigate]);

  if (!employeeId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No employee ID provided</h2>
          <Button onClick={() => navigate("/hr/data")}>Back to Employee List</Button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Employee not found</h2>
          <Button onClick={() => navigate("/hr/data")}>Back to Employee List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => navigate("/hr/data")}
        >
          <ArrowLeft size={16} />
          <span>Back to Employee List</span>
        </Button>
      </div>

      <EmployeeDetail employee={employee} activeTab={activeTab} />
    </div>
  );
}
