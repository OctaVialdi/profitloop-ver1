import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Employee, employeeService } from "@/services/employeeService";
import { useEmployees } from "@/hooks/useEmployees";

const MyInfoIndex = () => {
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("id");
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { employees } = useEmployees();

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        if (employeeId) {
          // Use the employees array and find the employee with matching ID
          // instead of calling fetchEmployeeById directly
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <CardContent className="p-4">
            Employee not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Information</h1>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {employee.name}!</h2>
          <p>
            This is your personal information page. You can view and manage your
            details here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyInfoIndex;
