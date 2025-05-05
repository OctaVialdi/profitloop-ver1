
import { useState, useEffect, useCallback } from "react";
import { Employee, employeeService } from "@/services/employeeService";
import { toast } from "sonner";

// Export the Employee type from the service
export type { Employee } from "@/services/employeeService";

export interface LegacyEmployee {
  id: string;
  name: string;
  email?: string;
  role?: string;
  status?: string;
  employee_id?: string;
  profile_image?: string;
  mobilePhone?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  maritalStatus?: string;
  bloodType?: string;
  religion?: string;
  nik?: string;
  passportNumber?: string;
  passportExpiry?: string;
  postalCode?: string;
  citizenAddress?: string;
  address?: string; // residential address
  organization_id: string; // Make this required to match Employee type
  // Legacy properties for backward compatibility
  employeeId?: string;
  barcode?: string;
  branch?: string;
  organization?: string;
  jobPosition?: string;
  jobLevel?: string;
  employmentStatus?: string;
  joinDate?: string;
  endDate?: string;
  signDate?: string;
  resignDate?: string;
}

// Export these types from employeeService for backward compatibility
export type { EmployeePersonalDetails, EmployeeIdentityAddress, EmployeeEmployment } from "@/services/employeeService";

// Converts a backend Employee to a LegacyEmployee format for frontend components
export const convertToLegacyFormat = (employee: Employee): LegacyEmployee => {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email || '',
    role: employee.role || '',
    status: employee.status || 'Active',
    employee_id: employee.employee_id || '',
    profile_image: employee.profile_image || '',
    mobilePhone: employee.mobile_phone || '',
    birthPlace: employee.birth_place || '',
    birthDate: employee.birth_date || '',
    gender: employee.gender || '',
    maritalStatus: employee.marital_status || '',
    bloodType: employee.blood_type || '',
    religion: employee.religion || '',
    nik: employee.nik || '',
    passportNumber: employee.passport_number || '',
    passportExpiry: employee.passport_expiry || '',
    postalCode: employee.postal_code || '',
    citizenAddress: employee.citizen_address || '',
    address: employee.address || '',
    organization_id: employee.organization_id,
    // Legacy properties
    employeeId: employee.employee_id || '',
    barcode: employee.barcode || '',
    branch: employee.branch || '',
    organization: employee.organization_id || '',
    jobPosition: employee.job_position || '',
    jobLevel: employee.job_level || '',
    employmentStatus: employee.employment_status || 'Active',
    joinDate: employee.join_date || '',
    endDate: '', // No field in new model
    signDate: employee.sign_date || '',
    resignDate: '' // No field in new model
  };
};

// Converts from LegacyEmployee (frontend) to Employee (backend) format
export const convertToApiFormat = (employee: LegacyEmployee): Partial<Employee> => {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    status: employee.status,
    employee_id: employee.employee_id || employee.employeeId,
    profile_image: employee.profile_image,
    mobile_phone: employee.mobilePhone || null,
    birth_place: employee.birthPlace || null,
    birth_date: employee.birthDate || null,
    gender: employee.gender || null,
    marital_status: employee.maritalStatus || null,
    blood_type: employee.bloodType || null,
    religion: employee.religion || null,
    nik: employee.nik || null,
    passport_number: employee.passportNumber || null,
    passport_expiry: employee.passportExpiry || null,
    postal_code: employee.postalCode || null,
    citizen_address: employee.citizenAddress || null,
    address: employee.address || null,
    organization_id: employee.organization_id || employee.organization,
    // Employment fields
    barcode: employee.barcode || null,
    job_position: employee.jobPosition || null,
    job_level: employee.jobLevel || null,
    employment_status: employee.employmentStatus || null,
    branch: employee.branch || null,
    join_date: employee.joinDate || null,
    sign_date: employee.signDate || null
  };
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.fetchEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error in useEmployees:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const addEmployee = useCallback(
    async (employeeData: Partial<Employee>) => {
      try {
        if (!employeeData.organization_id) {
          throw new Error("Organization ID is required");
        }
        
        const newEmployee = await employeeService.createEmployee(employeeData as any);
        
        if (newEmployee) {
          setEmployees((prev) => [...prev, newEmployee]);
          return newEmployee;
        }
        return null;
      } catch (error) {
        console.error("Error adding employee:", error);
        throw error;
      }
    },
    []
  );

  const updateEmployee = useCallback(
    async (id: string, data: Partial<Employee>) => {
      try {
        const updatedEmployee = await employeeService.updateEmployee(id, data);
        
        if (updatedEmployee) {
          setEmployees((prev) =>
            prev.map((emp) => (emp.id === id ? updatedEmployee : emp))
          );
          return updatedEmployee;
        }
        return null;
      } catch (error) {
        console.error("Error updating employee:", error);
        throw error;
      }
    },
    []
  );

  const deleteEmployee = useCallback(
    async (id: string) => {
      try {
        const success = await employeeService.deleteEmployee(id);
        
        if (success) {
          setEmployees((prev) => prev.filter((emp) => emp.id !== id));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting employee:", error);
        throw error;
      }
    },
    []
  );

  const addDummyEmployees = useCallback(async () => {
    try {
      const dummyEmployeesData = [
        {
          name: "John Doe",
          email: "john.doe@example.com",
          mobile_phone: "+6281234567890",
          birth_place: "Jakarta",
          birth_date: "1990-01-01",
          gender: "male",
          marital_status: "single",
          religion: "islam",
          blood_type: "O",
          nik: "1234567890123456",
          address: "Jl. Sudirman No. 123, Jakarta",
          organization_id: "96b17df8-c3c3-4ace-a622-0e3c1f5b6500" // Replace with actual org ID
        },
        {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          mobile_phone: "+6287654321098",
          birth_place: "Bandung",
          birth_date: "1992-05-15",
          gender: "female",
          marital_status: "married",
          religion: "catholicism",
          blood_type: "A",
          nik: "6543210987654321",
          address: "Jl. Gatot Subroto No. 456, Jakarta",
          organization_id: "96b17df8-c3c3-4ace-a622-0e3c1f5b6500" // Replace with actual org ID
        }
      ];
  
      const newEmployees = await Promise.all(
        dummyEmployeesData.map(empData => employeeService.createEmployee(empData))
      );
  
      const validEmployees = newEmployees.filter((emp): emp is Employee => emp !== null);
      
      if (validEmployees.length > 0) {
        setEmployees(prev => [...prev, ...validEmployees]);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error adding dummy employees:", error);
      throw error;
    }
  }, []);

  return {
    employees,
    isLoading,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addDummyEmployees
  };
};
