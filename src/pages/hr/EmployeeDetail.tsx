
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { EmployeeDetail as EmployeeDetailComponent } from "@/components/hr/EmployeeDetail";

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees } = useEmployees();

  // Find the employee with the matching ID
  const employee = employees.find(emp => emp.id === id);

  // Redirect the user to the new route format
  if (employee) {
    window.location.href = `/my-info/index?id=${id}`;
    return null;
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

  return null;
};

export default EmployeeDetail;
