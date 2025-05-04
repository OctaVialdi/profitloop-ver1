
import { supabase } from '@/integrations/supabase/client';

export class EmployeeService {
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
  [key: string]: any;
}
