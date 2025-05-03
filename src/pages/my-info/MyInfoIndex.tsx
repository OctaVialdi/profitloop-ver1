
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEmployees, Employee } from "@/hooks/useEmployees";
import { EmployeeDetail } from "@/components/hr/EmployeeDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MyInfoIndex() {
  const location = useLocation();
  const navigate = useNavigate();
  const { employees } = useEmployees();
  
  // Extract the employee ID from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const employeeId = queryParams.get("id");
  const activeTab = queryParams.get("tab") || "personal";
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  
  // Find the employee with the matching ID
  useEffect(() => {
    if (employeeId && employees) {
      const foundEmployee = employees.find(emp => emp.id === employeeId);
      setEmployee(foundEmployee || null);
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
