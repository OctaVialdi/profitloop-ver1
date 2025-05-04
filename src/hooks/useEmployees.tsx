import { useState, useEffect } from "react";
import { employeeService, Employee, EmployeeWithDetails } from "@/services/employeeService";
import { toast } from "sonner";

// Define the legacy employee interface that our components expect
export interface LegacyEmployee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  organization: string;
  jobPosition: string;
  jobLevel: string;
  employmentStatus: string;
  branch: string;
  joinDate: string;
  signDate: string;
  barcode: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  mobilePhone: string;
  religion: string;
  gender: string;
  maritalStatus: string;
  status: string;
  role: string;
  organization_id: string; // Required field
  employee_id: string;     // Making it required to match Employee type
  phone?: string;          // Adding missing properties
  bloodType?: string;      // Adding missing properties
}

export interface UseEmployeesResult {
  employees: EmployeeWithDetails[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  addEmployee: (employee: Partial<Employee>) => Promise<EmployeeWithDetails | null>;
  updateEmployee: (employee: Partial<Employee> & { id: string }) => Promise<EmployeeWithDetails | null>;
  removeEmployee: (id: string) => Promise<boolean>;
  getEmployee: (id: string) => Promise<EmployeeWithDetails | null>;
}

// Helper function to convert from new database format to legacy format
export function convertToLegacyFormat(employee: EmployeeWithDetails): LegacyEmployee {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email || "",
    employeeId: employee.employee_id || "",
    organization: employee.employment?.organization || "",
    jobPosition: employee.employment?.job_position || "",
    jobLevel: employee.employment?.job_level || "",
    employmentStatus: employee.employment?.employment_status || "",
    branch: employee.employment?.branch || "",
    joinDate: employee.employment?.join_date || "",
    signDate: employee.employment?.sign_date || "",
    barcode: employee.employment?.barcode || "",
    birthDate: employee.personalDetails?.birth_date || "",
    birthPlace: employee.personalDetails?.birth_place || "",
    address: employee.identityAddress?.residential_address || "",
    mobilePhone: employee.personalDetails?.mobile_phone || "",
    religion: employee.personalDetails?.religion || "",
    gender: employee.personalDetails?.gender || "",
    maritalStatus: employee.personalDetails?.marital_status || "",
    status: employee.status || "Active",
    role: employee.role || "employee",
    organization_id: employee.organization_id,
    employee_id: employee.employee_id,
    phone: employee.personalDetails?.phone || "",
    bloodType: employee.personalDetails?.blood_type || ""
  };
}

// Helper function to convert from legacy format to new database format
export function convertFromLegacyFormat(legacyEmployee: Partial<LegacyEmployee>): Partial<Employee> {
  // Basic employee data
  const employeeData: Partial<Employee> = {
    id: legacyEmployee.id,
    name: legacyEmployee.name,
    email: legacyEmployee.email,
    employee_id: legacyEmployee.employeeId || legacyEmployee.employee_id,
    organization_id: legacyEmployee.organization_id,
    status: legacyEmployee.status,
    role: legacyEmployee.role
  };

  return employeeData;
}

// Re-export the employeeService from the service for convenience
export { employeeService } from "@/services/employeeService";

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
