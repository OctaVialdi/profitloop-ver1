
import { supabase } from '@/integrations/supabase/client';

export class EmployeeService {
  // Fetch all employees
  async fetchEmployees(): Promise<EmployeeWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) throw error;
      return data as EmployeeWithDetails[] || [];
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      this.handleError(error, 'Failed to fetch employees');
      return [];
    }
  }

  // Fetch a single employee by ID
  async fetchEmployeeById(id: string): Promise<EmployeeWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as EmployeeWithDetails || null;
    } catch (error) {
      console.error(`Failed to fetch employee with ID ${id}:`, error);
      this.handleError(error, `Failed to fetch employee with ID ${id}`);
      return null;
    }
  }

  // Create a new employee
  async createEmployee(employee: Partial<Employee>): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select('*')
        .single();

      if (error) throw error;
      return data as Employee || null;
    } catch (error) {
      console.error('Failed to create employee:', error);
      this.handleError(error, 'Failed to create employee');
      return null;
    }
  }

  // Update an employee
  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data as Employee || null;
    } catch (error) {
      console.error(`Failed to update employee with ID ${id}:`, error);
      this.handleError(error, `Failed to update employee with ID ${id}`);
      return null;
    }
  }

  // Delete an employee
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Failed to delete employee with ID ${id}:`, error);
      this.handleError(error, `Failed to delete employee with ID ${id}`);
      return false;
    }
  }

  // Update employee employment details
  async updateEmployeeEmployment(employeeId: string, employmentDetails: any): Promise<any> {
    return this.saveEmploymentDetails({
      employee_id: employeeId,
      ...employmentDetails
    });
  }

  // Method referenced in updateEmploymentDetails
  async saveEmploymentDetails(employmentDetails: any): Promise<any> {
    try {
      console.log("Saving employment details:", employmentDetails);
      
      // Make sure the employee_id exists
      if (!employmentDetails.employee_id) {
        throw new Error('Employee ID is required for saving employment details');
      }
      
      const { data, error } = await supabase
        .from('employee_employment')
        .upsert(employmentDetails, {
          onConflict: 'employee_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error("Error in saveEmploymentDetails:", error);
        throw error;
      }

      console.log("Employment details saved successfully:", data);
      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to save employment details data:', error);
      this.handleError(error, 'Failed to save employment details data');
      return null;
    }
  }

  // Update employee personal details
  async updateEmployeePersonalDetails(employeeId: string, personalDetails: any): Promise<any> {
    try {
      const details = {
        employee_id: employeeId,
        ...personalDetails
      };
      
      const { data, error } = await supabase
        .from('employee_personal_details')
        .upsert(details, {
          onConflict: 'employee_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to save personal details:', error);
      this.handleError(error, 'Failed to save personal details');
      return null;
    }
  }

  // Update employee identity address
  async updateEmployeeIdentityAddress(employeeId: string, addressDetails: any): Promise<any> {
    try {
      const details = {
        employee_id: employeeId,
        ...addressDetails
      };
      
      const { data, error } = await supabase
        .from('employee_identity_address')
        .upsert(details, {
          onConflict: 'employee_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to save identity address:', error);
      this.handleError(error, 'Failed to save identity address');
      return null;
    }
  }

  // Fetch family members
  async fetchFamilyMembers(employeeId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('employee_family')
        .select('*')
        .eq('employee_id', employeeId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch family members:', error);
      this.handleError(error, 'Failed to fetch family members');
      return [];
    }
  }

  // Save family member
  async saveFamilyMember(familyMember: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('employee_family')
        .upsert(familyMember)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to save family member:', error);
      this.handleError(error, 'Failed to save family member');
      return null;
    }
  }

  // Delete family member
  async deleteFamilyMember(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_family')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete family member:', error);
      this.handleError(error, 'Failed to delete family member');
      return false;
    }
  }

  // Upload profile image
  async uploadProfileImage(employeeId: string, file: File): Promise<string | null> {
    try {
      const fileName = `${employeeId}_${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('profile_images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('profile_images')
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      this.handleError(error, 'Failed to upload profile image');
      return null;
    }
  }

  // Add the handleError method that's referenced in saveEmploymentDetails
  private handleError(error: any, message: string): void {
    console.error(message, error);
    // Additional error handling logic if needed
  }
}

// Singleton instance
export const employeeService = new EmployeeService();

// Define the Employee and EmployeeWithDetails types
export interface Employee {
  id: string;
  employee_id: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface EmployeeWithDetails extends Employee {
  employment?: {
    barcode?: string;
    organization?: string;
    job_position?: string;
    job_level?: string;
    employment_status?: string;
    branch?: string;
    join_date?: string;
    sign_date?: string;
    grade?: string;
    class?: string;
    approval_line?: string;
    manager_id?: string | null;
    [key: string]: any;
  };
  personalDetails?: {
    mobile_phone?: string;
    birth_place?: string;
    birth_date?: string;
    gender?: string;
    marital_status?: string;
    blood_type?: string;
    religion?: string;
    [key: string]: any;
  };
  identityAddress?: {
    nik?: string;
    passport_number?: string;
    passport_expiry?: string;
    postal_code?: string;
    citizen_address?: string;
    residential_address?: string;
    [key: string]: any;
  };
  [key: string]: any;
}
