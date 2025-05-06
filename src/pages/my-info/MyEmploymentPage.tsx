
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader } from "lucide-react";
import { Employee, employeeService } from "@/services/employeeService";
import { useEmployees } from "@/hooks/useEmployees";
import { EmploymentSection } from "@/components/hr/employee-detail";
import { Skeleton } from "@/components/ui/skeleton";

const MyEmploymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("id");
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { employees } = useEmployees();

  // Stub function for handleEdit - not needed in the My Info context
  // but required by the component props
  const handleEdit = (section: string) => {
    console.log(`Edit ${section} requested but not implemented in My Info view`);
    // In the My Info view, we don't need editing functionality
    // but we provide this function to satisfy the component props
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        if (employeeId) {
          // Find employee in the cache
          const foundEmployee = employees.find(emp => emp.id === employeeId);
          if (foundEmployee) {
            setEmployee(foundEmployee);
          } else {
            console.error("Employee not found");
          }
        } else {
          console.error("No employee ID provided");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    };

    if (employees.length > 0) {
      fetchEmployee();
    }
  }, [employeeId, employees]);

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

      <EmploymentSection 
        employee={employee}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default MyEmploymentPage;
