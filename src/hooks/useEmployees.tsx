
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { employeeService, EmployeeWithDetails, Employee } from '@/services/employeeService';

// Define the LegacyEmployee interface that many components are looking for
export interface LegacyEmployee {
  id: string;
  name: string;
  email?: string;
  employeeId?: string;
  barcode?: string;
  organization?: string;
  jobPosition?: string;
  jobLevel?: string;
  employmentStatus?: string;
  branch?: string;
  joinDate?: string;
  endDate?: string;
  signDate?: string;
  resignDate?: string;
  birthDate?: string;
  birthPlace?: string;
  address?: string;
  mobilePhone?: string;
  religion?: string;
  gender?: string;
  maritalStatus?: string;
  [key: string]: any;
}

// Define education and work experience interfaces
export interface EmployeeEducation {
  id: string;
  employee_id: string;
  institution: string;
  degree: string;
  field: string;
  start_year: string;
  end_year: string;
  description?: string;
  [key: string]: any;
}

export interface EmployeeWorkExperience {
  id: string;
  employee_id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description?: string;
  [key: string]: any;
}

// Converter function to transform EmployeeWithDetails to LegacyEmployee format
export const convertToLegacyFormat = (employee: EmployeeWithDetails): LegacyEmployee => {
  return {
    id: employee.id,
    name: employee.name || '',
    email: employee.email || '',
    employeeId: employee.employee_id || '',
    barcode: employee.employment?.barcode,
    organization: employee.employment?.organization,
    jobPosition: employee.employment?.job_position,
    jobLevel: employee.employment?.job_level,
    employmentStatus: employee.employment?.employment_status,
    branch: employee.employment?.branch,
    joinDate: employee.employment?.join_date,
    signDate: employee.employment?.sign_date,
    birthDate: employee.personalDetails?.birth_date,
    birthPlace: employee.personalDetails?.birth_place,
    mobilePhone: employee.personalDetails?.mobile_phone,
    religion: employee.personalDetails?.religion,
    gender: employee.personalDetails?.gender,
    maritalStatus: employee.personalDetails?.marital_status,
    // Include any additional fields that might be needed
  };
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedEmployees = await employeeService.fetchEmployees();
      setEmployees(fetchedEmployees);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error fetching employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize by fetching employees
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Add a new employee
  const addEmployee = async (employee: Partial<Employee>) => {
    try {
      const newEmployee = await employeeService.createEmployee(employee);
      if (newEmployee) {
        await fetchEmployees(); // Refetch to get the latest data
        return newEmployee;
      }
      throw new Error('Failed to create employee');
    } catch (err: any) {
      console.error('Error adding employee:', err);
      throw err;
    }
  };

  // Update an employee
  const updateEmployee = async (updates: Partial<Employee>) => {
    try {
      if (!updates.id) throw new Error('Employee ID is required for update');
      
      const updatedEmployee = await employeeService.updateEmployee(updates.id, updates);
      if (updatedEmployee) {
        setEmployees(employees.map(emp => 
          emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp
        ));
        return updatedEmployee;
      }
      throw new Error('Failed to update employee');
    } catch (err: any) {
      console.error('Error updating employee:', err);
      throw err;
    }
  };

  // Update employment details
  const updateEmploymentDetails = async (employeeId: string, employmentData: any) => {
    try {
      if (!employeeId) throw new Error('Employee ID is required for employment update');
      
      const result = await employeeService.updateEmployeeEmployment(employeeId, employmentData);
      
      if (result) {
        // Update the local state with the new employment data
        setEmployees(employees.map(emp => 
          emp.id === employeeId ? { 
            ...emp, 
            employment: { 
              ...emp.employment,
              ...employmentData
            } 
          } : emp
        ));
        return result;
      }
      throw new Error('Failed to update employment details');
    } catch (err: any) {
      console.error('Error updating employment details:', err);
      throw err;
    }
  };

  // Update personal details
  const updatePersonalDetails = async (employeeId: string, personalData: any) => {
    try {
      if (!employeeId) throw new Error('Employee ID is required for personal details update');
      
      const result = await employeeService.updateEmployeePersonalDetails(employeeId, personalData);
      
      if (result) {
        // Update the local state with the new personal data
        setEmployees(employees.map(emp => 
          emp.id === employeeId ? { 
            ...emp, 
            personalDetails: { 
              ...emp.personalDetails,
              ...personalData
            } 
          } : emp
        ));
        return result;
      }
      throw new Error('Failed to update personal details');
    } catch (err: any) {
      console.error('Error updating personal details:', err);
      throw err;
    }
  };

  // Update identity address
  const updateIdentityAddress = async (employeeId: string, addressData: any) => {
    try {
      if (!employeeId) throw new Error('Employee ID is required for identity address update');
      
      const result = await employeeService.updateEmployeeIdentityAddress(employeeId, addressData);
      
      if (result) {
        // Update the local state with the new address data
        setEmployees(employees.map(emp => 
          emp.id === employeeId ? { 
            ...emp, 
            identityAddress: { 
              ...emp.identityAddress,
              ...addressData
            } 
          } : emp
        ));
        return result;
      }
      throw new Error('Failed to update identity address');
    } catch (err: any) {
      console.error('Error updating identity address:', err);
      throw err;
    }
  };

  // Delete an employee
  const deleteEmployee = async (id: string) => {
    try {
      const success = await employeeService.deleteEmployee(id);
      if (success) {
        setEmployees(employees.filter(emp => emp.id !== id));
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Error deleting employee:', err);
      throw err;
    }
  };

  // Education functions
  const addEducation = async (employeeId: string, educationData: any) => {
    try {
      // Implement when needed
      console.log('Add education function called with:', employeeId, educationData);
      return null;
    } catch (err) {
      console.error('Error adding education:', err);
      throw err;
    }
  };

  const updateEducation = async (id: string, updates: any) => {
    try {
      // Implement when needed
      console.log('Update education function called with:', id, updates);
      return null;
    } catch (err) {
      console.error('Error updating education:', err);
      throw err;
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      // Implement when needed
      console.log('Delete education function called with:', id);
      return true;
    } catch (err) {
      console.error('Error deleting education:', err);
      throw err;
    }
  };

  // Work experience functions
  const addWorkExperience = async (employeeId: string, experienceData: any) => {
    try {
      // Implement when needed
      console.log('Add work experience function called with:', employeeId, experienceData);
      return null;
    } catch (err) {
      console.error('Error adding work experience:', err);
      throw err;
    }
  };

  const updateWorkExperience = async (id: string, updates: any) => {
    try {
      // Implement when needed
      console.log('Update work experience function called with:', id, updates);
      return null;
    } catch (err) {
      console.error('Error updating work experience:', err);
      throw err;
    }
  };

  const deleteWorkExperience = async (id: string) => {
    try {
      // Implement when needed
      console.log('Delete work experience function called with:', id);
      return true;
    } catch (err) {
      console.error('Error deleting work experience:', err);
      throw err;
    }
  };

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    updateEmploymentDetails,
    updatePersonalDetails,
    updateIdentityAddress,
    // Education-related functions
    addEducation,
    updateEducation,
    deleteEducation,
    // Work experience-related functions
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience
  };
};
