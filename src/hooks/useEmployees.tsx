
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { employeeService, EmployeeWithDetails, Employee } from '@/services/employeeService';

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

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    updateEmploymentDetails
  };
};
