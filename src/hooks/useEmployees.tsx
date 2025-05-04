
import { useState, useEffect } from "react";
import { employeeService, Employee, EmployeeWithDetails } from "@/services/employeeService";
import { toast } from "sonner";

export interface UseEmployeesResult {
  employees: EmployeeWithDetails[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  addEmployee: (employee: Partial<Employee>) => Promise<EmployeeWithDetails | null>;
  updateEmployee: (employee: Partial<Employee> & { id: string }) => Promise<EmployeeWithDetails | null>;
  removeEmployee: (id: string) => Promise<boolean>;
  getEmployee: (id: string) => Promise<EmployeeWithDetails | null>;
}

export function useEmployees(): UseEmployeesResult {
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.fetchEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employee data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async (employeeData: Partial<Employee>) => {
    try {
      const newEmployee = await employeeService.createEmployee(employeeData);
      if (newEmployee) {
        setEmployees([...employees, newEmployee]);
        toast.success("Employee added successfully");
        return newEmployee;
      }
      return null;
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee");
      return null;
    }
  };

  const updateEmployee = async (updatedEmployee: Partial<Employee> & { id: string }) => {
    try {
      const result = await employeeService.updateEmployee(
        updatedEmployee.id,
        updatedEmployee
      );
      
      if (result) {
        setEmployees(
          employees.map((employee) => 
            employee.id === result.id ? result : employee
          )
        );
        toast.success("Employee updated successfully");
        return result;
      }
      return null;
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
      return null;
    }
  };

  const removeEmployee = async (id: string) => {
    try {
      const success = await employeeService.deleteEmployee(id);
      if (success) {
        setEmployees(employees.filter((employee) => employee.id !== id));
        toast.success("Employee removed successfully");
      }
      return success;
    } catch (error) {
      console.error("Error removing employee:", error);
      toast.error("Failed to remove employee");
      return false;
    }
  };
  
  const getEmployee = async (id: string) => {
    try {
      return await employeeService.fetchEmployeeById(id);
    } catch (error) {
      console.error("Error getting employee:", error);
      return null;
    }
  };

  return {
    employees,
    isLoading,
    refetch: fetchEmployees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    getEmployee
  };
}

// Re-export types from the service for convenience
export type { 
  Employee,
  EmployeeWithDetails, 
  EmployeePersonalDetails,
  EmployeeIdentityAddress,
  EmployeeEmployment,
  EmployeeFamily,
  EmployeeEmergencyContact,
  EmployeeEducation,
  EmployeeWorkExperience
} from "@/services/employeeService";
