
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
  profileImage?: string;   // Field for profile image URL
}

export interface UseEmployeesResult {
  employees: EmployeeWithDetails[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  addEmployee: (employee: Partial<Employee>) => Promise<EmployeeWithDetails | null>;
  updateEmployee: (employee: Partial<Employee> & { id: string }) => Promise<EmployeeWithDetails | null>;
  removeEmployee: (id: string) => Promise<boolean>;
  getEmployee: (id: string) => Promise<EmployeeWithDetails | null>;
  uploadProfileImage: (employeeId: string, file: File) => Promise<string | null>;
  updatePersonalDetails: (employeeId: string, details: any) => Promise<any>;
  updateEmploymentDetails: (employeeId: string, details: any) => Promise<any>;
  updateIdentityAddress: (employeeId: string, details: any) => Promise<any>;
  addEducation: (education: any) => Promise<any>;
  updateEducation: (id: string, education: any) => Promise<any>;
  deleteEducation: (id: string) => Promise<boolean>;
  addWorkExperience: (experience: any) => Promise<any>;
  updateWorkExperience: (id: string, experience: any) => Promise<any>;
  deleteWorkExperience: (id: string) => Promise<boolean>;
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
    phone: employee.personalDetails?.mobile_phone || "",
    bloodType: employee.personalDetails?.blood_type || "",
    profileImage: employee.profile_image || "",
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
    role: legacyEmployee.role,
    profile_image: legacyEmployee.profileImage
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

  // Upload employee profile image
  const uploadProfileImage = async (employeeId: string, file: File) => {
    try {
      console.log("Uploading profile image for employee:", employeeId);
      const imageUrl = await employeeService.uploadProfileImage(employeeId, file);
      
      if (imageUrl) {
        // Update the local employees state with the new image URL
        setEmployees(
          employees.map((employee) => 
            employee.id === employeeId 
              ? { ...employee, profile_image: imageUrl } 
              : employee
          )
        );
        toast.success("Profile image uploaded successfully");
        return imageUrl;
      }
      return null;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
      return null;
    }
  };

  // Update personal details with better error handling
  const updatePersonalDetails = async (employeeId: string, details: any) => {
    try {
      console.log("Updating personal details for employee:", employeeId, details);
      const result = await employeeService.updatePersonalDetails(employeeId, details);
      
      if (result) {
        // Refresh the employee data to get the updated details
        await fetchEmployees();
        toast.success("Personal details updated successfully");
        return result;
      }
      return null;
    } catch (error: any) {
      console.error("Error updating personal details:", error);
      toast.error(error?.message || "Failed to update personal details");
      return null;
    }
  };

  // Update employment details
  const updateEmploymentDetails = async (employeeId: string, details: any) => {
    try {
      console.log("Updating employment details for employee:", employeeId, details);
      const result = await employeeService.updateEmploymentDetails(employeeId, details);
      
      if (result) {
        // Refresh the employee data to get the updated details
        await fetchEmployees();
        toast.success("Employment details updated successfully");
        return result;
      }
      return null;
    } catch (error: any) {
      console.error("Error updating employment details:", error);
      toast.error(error?.message || "Failed to update employment details");
      return null;
    }
  };

  // Update identity address
  const updateIdentityAddress = async (employeeId: string, details: any) => {
    try {
      console.log("Updating identity address for employee:", employeeId, details);
      const result = await employeeService.updateIdentityAddress(employeeId, details);
      
      if (result) {
        // Refresh the employee data to get the updated details
        await fetchEmployees();
        toast.success("Identity and address updated successfully");
        return result;
      }
      return null;
    } catch (error: any) {
      console.error("Error updating identity address:", error);
      toast.error(error?.message || "Failed to update identity and address");
      return null;
    }
  };

  // Add education
  const addEducation = async (education: any) => {
    try {
      console.log("Adding education:", education);
      const result = await employeeService.saveEducation(education);
      
      if (result) {
        // Refresh the employee data to get the updated details
        await fetchEmployees();
        toast.success("Education added successfully");
        return result;
      }
      return null;
    } catch (error: any) {
      console.error("Error adding education:", error);
      toast.error(error?.message || "Failed to add education");
      return null;
    }
  };

  // Update education
  const updateEducation = async (id: string, education: any) => {
    try {
      console.log("Updating education:", id, education);
      const result = await employeeService.saveEducation({...education, id});
      
      if (result) {
        // Refresh the employee data to get the updated details
        await fetchEmployees();
        toast.success("Education updated successfully");
        return result;
      }
      return null;
    } catch (error: any) {
      console.error("Error updating education:", error);
      toast.error(error?.message || "Failed to update education");
      return null;
    }
  };

  // Delete education
  const deleteEducation = async (id: string) => {
    try {
      console.log("Deleting education:", id);
      const result = await employeeService.deleteEducation(id);
      
      if (result) {
        // Refresh the employee data to get the updated details
        await fetchEmployees();
        toast.success("Education deleted successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error deleting education:", error);
      toast.error(error?.message || "Failed to delete education");
      return false;
    }
  };

  // Add work experience
  const addWorkExperience = async (experience: any) => {
    try {
      console.log("Adding work experience:", experience);
      const result = await employeeService.saveWorkExperience(experience);
      
      if (result) {
        // Refresh the employee data to get the updated details
        await fetchEmployees();
        toast.success("Work experience added successfully");
        return result;
      }
      return null;
    } catch (error: any) {
      console.error("Error adding work experience:", error);
      toast.error(error?.message || "Failed to add work experience");
      return null;
    }
  };

  // Update work experience
  const updateWorkExperience = async (id: string, experience: any) => {
    try {
      console.log("Updating work experience:", id, experience);
      const result = await employeeService.saveWorkExperience({...experience, id});
      
      if (result) {
        // Refresh the employee data to get the updated details
        await fetchEmployees();
        toast.success("Work experience updated successfully");
        return result;
      }
      return null;
    } catch (error: any) {
      console.error("Error updating work experience:", error);
      toast.error(error?.message || "Failed to update work experience");
      return null;
    }
  };

  // Delete work experience
  const deleteWorkExperience = async (id: string) => {
    try {
      console.log("Deleting work experience:", id);
      const result = await employeeService.deleteWorkExperience(id);
      
      if (result) {
        // Refresh the employee data to get the updated details
        await fetchEmployees();
        toast.success("Work experience deleted successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error deleting work experience:", error);
      toast.error(error?.message || "Failed to delete work experience");
      return false;
    }
  };

  return {
    employees,
    isLoading,
    refetch: fetchEmployees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    getEmployee,
    uploadProfileImage,
    updatePersonalDetails,
    updateEmploymentDetails,
    updateIdentityAddress,
    addEducation,
    updateEducation,
    deleteEducation,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience
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
