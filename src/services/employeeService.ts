import { supabase } from "@/integrations/supabase/client";

export interface Employee {
  id: string;
  name: string;
  email?: string;
  role?: string;
  status?: string;
  employee_id?: string;
  profile_image?: string;
  birth_place?: string;
  birth_date?: string;
  gender?: string;
  marital_status?: string;
  blood_type?: string;
  religion?: string;
  nik?: string;
  passport_number?: string;
  passport_expiry?: string;
  postal_code?: string;
  citizen_address?: string;
  address?: string;
  mobile_phone?: string;
  organization_id: string;
  barcode?: string;
  job_position?: string;
  job_level?: string;
  branch?: string;
  join_date?: string;
  sign_date?: string;
  employment?: EmployeeEmployment; // Reference to employment data
}

export interface EmployeePersonalDetails {
  name: string;
  mobile_phone?: string;
  birth_place?: string;
  birth_date?: string;
  gender?: string;
  marital_status?: string;
  blood_type?: string;
  religion?: string;
  profile_image?: string;
}

export interface EmployeeIdentityAddress {
  nik?: string;
  passport_number?: string;
  passport_expiry?: string;
  address?: string;
  citizen_address?: string;
  postal_code?: string;
}

export interface EmployeeEmployment {
  id?: string;
  employee_id?: string;
  barcode?: string;
  company_name?: string;
  organization_name?: string;
  branch?: string;
  job_position?: string;
  job_level?: string;
  employment_status?: string;
  join_date?: string;
  sign_date?: string;
}

export const employeeService = {
  async fetchEmployees(): Promise<Employee[]> {
    try {
      // First fetch all employees
      const { data: employees, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      if (!employees || employees.length === 0) {
        return [];
      }

      // Now fetch employment details for all employees
      const { data: employmentData, error: empError } = await supabase
        .from('employee_employment')
        .select('*')
        .in('employee_id', employees.map(emp => emp.id));

      if (empError) {
        console.error("Error fetching employment data:", empError);
        // Don't throw here, we can still return employees without employment data
      }

      // Map employment data to the corresponding employees
      const employeesWithEmployment = employees.map(emp => {
        const employment = employmentData?.find(ed => ed.employee_id === emp.id);
        return {
          ...emp,
          employment: employment || undefined
        };
      });

      return employeesWithEmployment as Employee[];
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  },

  async createEmployee(employeeData: Partial<Employee>): Promise<Employee | null> {
    try {
      // Omit the 'employment' property from employeeData to avoid inserting it directly into the 'employees' table
      const { employment, ...employeeDetails } = employeeData;

      // First, insert the employee details into the 'employees' table
      const { data: newEmployee, error: employeeError } = await supabase
        .from('employees')
        .insert([employeeDetails])
        .select()
        .single();

      if (employeeError) {
        throw employeeError;
      }

      if (!newEmployee) {
        console.error("Failed to create employee in 'employees' table");
        return null;
      }

      // If employment data is provided, insert it into the 'employee_employment' table
      if (employment) {
        const employmentData = {
          ...employment,
          employee_id: newEmployee.id // Use the new employee's ID as the foreign key
        };

        const { data: newEmployment, error: employmentError } = await supabase
          .from('employee_employment')
          .insert([employmentData])
          .select()
          .single();

        if (employmentError) {
          // If employment insertion fails, you might want to handle this differently
          // For example, you could log the error and continue, or delete the employee record
          console.error("Failed to create employment data:", employmentError);
          // Optionally, delete the employee record if employment creation fails
          // await supabase.from('employees').delete().eq('id', newEmployee.id);
          return newEmployee as Employee; // Return the employee without employment data
        }

        // If employment data was successfully inserted, merge it with the employee data
        return { ...newEmployee, employment: newEmployment } as Employee;
      }

      // If no employment data was provided, return the employee data
      return newEmployee as Employee;
    } catch (error) {
      console.error("Error creating employee:", error);
      return null;
    }
  },

  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee | null> {
    try {
      // Omit the 'employment' property from employeeData to avoid updating it directly in the 'employees' table
      const { employment, ...employeeDetails } = employeeData;

      // First, update the employee details in the 'employees' table
      const { data: updatedEmployee, error: employeeError } = await supabase
        .from('employees')
        .update(employeeDetails)
        .eq('id', id)
        .select()
        .single();

      if (employeeError) {
        throw employeeError;
      }

      if (!updatedEmployee) {
        console.error("Employee not found or failed to update in 'employees' table");
        return null;
      }

      // If employment data is provided, update it in the 'employee_employment' table
      if (employment) {
        const { data: existingEmployment } = await supabase
          .from('employee_employment')
          .select('*')
          .eq('employee_id', id)
          .single();

        if (existingEmployment) {
          // Update existing employment data
          const { data: updatedEmployment, error: employmentError } = await supabase
            .from('employee_employment')
            .update(employment)
            .eq('employee_id', id)
            .select()
            .single();

          if (employmentError) {
            console.error("Failed to update employment data:", employmentError);
            return updatedEmployee as Employee; // Return the employee with the original employment data
          }

          return { ...updatedEmployee, employment: updatedEmployment } as Employee;
        } else {
          // Insert new employment data
           const employmentData = {
            ...employment,
            employee_id: updatedEmployee.id // Use the new employee's ID as the foreign key
          };

          const { data: newEmployment, error: employmentError } = await supabase
            .from('employee_employment')
            .insert([employmentData])
            .select()
            .single();

          if (employmentError) {
            // If employment insertion fails, you might want to handle this differently
            // For example, you could log the error and continue, or delete the employee record
            console.error("Failed to create employment data:", employmentError);
            // Optionally, delete the employee record if employment creation fails
            // await supabase.from('employees').delete().eq('id', newEmployee.id);
            return updatedEmployee as Employee; // Return the employee without employment data
          }

          // If employment data was successfully inserted, merge it with the employee data
          return { ...updatedEmployee, employment: newEmployment } as Employee;
        }
      }

      // If no employment data was provided, return the updated employee data
      return updatedEmployee as Employee;
    } catch (error) {
      console.error("Error updating employee:", error);
      return null;
    }
  },

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      // First, delete the employment data from the 'employee_employment' table
      const { error: employmentError } = await supabase
        .from('employee_employment')
        .delete()
        .eq('employee_id', id);

      if (employmentError) {
        console.error("Failed to delete employment data:", employmentError);
        // Depending on your requirements, you might want to stop here if deleting employment data is crucial
      }

      // Then, delete the employee from the 'employees' table
      const { error: employeeError } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (employeeError) {
        throw employeeError;
      }

      return true;
    } catch (error) {
      console.error("Error deleting employee:", error);
      return false;
    }
  },
};
