
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

export interface EmployeeWithDetails extends Employee {
  familyMembers?: EmployeeFamily[];
  education?: EmployeeEducation[];
  assets?: EmployeeAsset[];
  files?: EmployeeFile[];
}

export interface EmployeePersonalDetails {
  name?: string;
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

export interface EmployeeFamily {
  id?: string;
  employee_id?: string;
  name: string;
  relationship?: string;
  gender?: string;
  age?: number;
  occupation?: string;
  phone?: string;
  address?: string;
  is_emergency_contact?: boolean;
}

export interface EmployeeEducation {
  id?: string;
  employee_id?: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  description?: string;
}

export interface EmployeeAsset {
  id?: string;
  employee_id?: string;
  name: string;
  asset_type: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  asset_tag?: string;
  specifications?: string;
  purchase_date?: string;
  purchase_price?: number;
  assigned_date?: string;
  expected_return_date?: string;
  status?: string;
  notes?: string;
}

export interface EmployeeFile {
  id?: string;
  employee_id?: string;
  name: string;
  file_type: string;
  file_url: string;
  file_size?: number;
  upload_date?: string;
  description?: string;
  status?: string;
  tags?: string[];
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

  async fetchEmployeeById(id: string): Promise<Employee | null> {
    try {
      // Fetch employee base data
      const { data: employee, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!employee) {
        return null;
      }

      // Fetch employment data
      const { data: employment, error: empError } = await supabase
        .from('employee_employment')
        .select('*')
        .eq('employee_id', id)
        .single();

      if (empError && empError.code !== 'PGRST116') { // Not found is ok
        console.error("Error fetching employment data:", empError);
      }

      // Return combined data
      return {
        ...employee,
        employment: employment || undefined
      } as Employee;
    } catch (error) {
      console.error("Error fetching employee by ID:", error);
      return null;
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

  async addDummyEmployees(): Promise<boolean> {
    try {
      // Generate unique employee IDs for new employees
      const generateUniqueId = () => `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // First dummy employee data - make sure name is required and present
      const employee1Data = {
        name: "John Doe", // Name must be required
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
        organization_id: "96b17df8-c3c3-4ace-a622-0e3c1f5b6500", // Required field
        employee_id: generateUniqueId()
      };

      // Insert first employee - use a single object, not an array
      const { data: newEmployee1, error: error1 } = await supabase
        .from('employees')
        .insert(employee1Data) // Pass a single object, not an array
        .select('*')
        .single();

      if (error1) {
        console.error("Error inserting first employee:", error1);
        return false;
      }

      // Second dummy employee data - make sure name is required and present
      const employee2Data = {
        name: "Jane Smith", // Name must be required
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
        organization_id: "96b17df8-c3c3-4ace-a622-0e3c1f5b6500", // Required field
        employee_id: generateUniqueId()
      };

      // Insert second employee - use a single object, not an array
      const { data: newEmployee2, error: error2 } = await supabase
        .from('employees')
        .insert(employee2Data) // Pass a single object, not an array
        .select('*')
        .single();

      if (error2) {
        console.error("Error inserting second employee:", error2);
        return false;
      }

      // Add employment data for first employee
      if (newEmployee1) {
        const employment1 = {
          employee_id: newEmployee1.id,
          organization_name: "Finance Department",
          branch: "Jakarta HQ",
          job_position: "Finance Officer"
        };

        const { error: empError1 } = await supabase
          .from('employee_employment')
          .insert(employment1);

        if (empError1) {
          console.error("Error adding employment data for first employee:", empError1);
        }
      }

      // Add employment data for second employee
      if (newEmployee2) {
        const employment2 = {
          employee_id: newEmployee2.id,
          organization_name: "Marketing Department",
          branch: "Jakarta HQ",
          job_position: "Marketing Executive"
        };

        const { error: empError2 } = await supabase
          .from('employee_employment')
          .insert(employment2);

        if (empError2) {
          console.error("Error adding employment data for second employee:", empError2);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error adding dummy employees:", error);
      throw error;
    }
  },

  // Additional methods needed for employee details
  async updateEmployeePersonalDetails(employeeId: string, data: Partial<EmployeePersonalDetails>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', employeeId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating employee personal details:", error);
      return false;
    }
  },

  async updateEmployeeBasicInfo(employeeId: string, data: { name?: string; email?: string }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', employeeId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating employee basic info:", error);
      return false;
    }
  },

  async updateEmployeeIdentityAddress(employeeId: string, data: Partial<EmployeeIdentityAddress>): Promise<boolean> {
    try {
      // Handle residential_address field mapping to address
      if ('residential_address' in data) {
        data.address = data.residential_address as string;
        delete data.residential_address;
      }

      const { error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', employeeId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating employee identity/address:", error);
      return false;
    }
  },

  async updateEmployeeEmployment(employeeId: string, data: Partial<EmployeeEmployment>): Promise<boolean> {
    try {
      // Handle organization field mapping to organization_name
      if ('organization' in data) {
        data.organization_name = data.organization as string;
        delete data.organization;
      }

      // Check if the employment record exists
      const { data: existingEmployment, error: checkError } = await supabase
        .from('employee_employment')
        .select('id')
        .eq('employee_id', employeeId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingEmployment) {
        // Update existing record
        const { error } = await supabase
          .from('employee_employment')
          .update(data)
          .eq('employee_id', employeeId);
          
        if (error) throw error;
      } else {
        // Create new record
        const newData = {
          ...data,
          employee_id: employeeId
        };
        
        const { error } = await supabase
          .from('employee_employment')
          .insert([newData]);
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error updating employee employment:", error);
      return false;
    }
  },

  async getEmployeeEmploymentData(employeeId: string): Promise<EmployeeEmployment | null> {
    try {
      const { data, error } = await supabase
        .from('employee_employment')
        .select('*')
        .eq('employee_id', employeeId)
        .maybeSingle();
      
      if (error) throw error;
      return data as EmployeeEmployment;
    } catch (error) {
      console.error("Error fetching employee employment data:", error);
      return null;
    }
  },

  async createOrUpdateEmployeeEmployment(employeeId: string, data: Partial<EmployeeEmployment>): Promise<boolean> {
    try {
      const { data: existingData } = await supabase
        .from('employee_employment')
        .select('id')
        .eq('employee_id', employeeId)
        .maybeSingle();
      
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('employee_employment')
          .update(data)
          .eq('employee_id', employeeId);
          
        if (error) throw error;
      } else {
        // Create new record
        const newData = {
          ...data,
          employee_id: employeeId
        };
        
        const { error } = await supabase
          .from('employee_employment')
          .insert([newData]);
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error creating/updating employee employment:", error);
      return false;
    }
  },

  async updateEmployeeProfileImage(employeeId: string, imageUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ profile_image: imageUrl })
        .eq('id', employeeId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating employee profile image:", error);
      return false;
    }
  },

  // Family members related functions
  async getFamilyMembers(employeeId: string): Promise<EmployeeFamily[]> {
    try {
      const { data, error } = await supabase
        .from('employee_family_members')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EmployeeFamily[] || [];
    } catch (error) {
      console.error("Error fetching family members:", error);
      return [];
    }
  },

  async addFamilyMember(employeeId: string, memberData: Omit<EmployeeFamily, 'id'>): Promise<EmployeeFamily | null> {
    try {
      const data = {
        ...memberData,
        employee_id: employeeId
      };
      
      const { data: newMember, error } = await supabase
        .from('employee_family_members')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return newMember as EmployeeFamily;
    } catch (error) {
      console.error("Error adding family member:", error);
      return null;
    }
  },

  async updateFamilyMember(memberId: string, data: Partial<EmployeeFamily>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_family_members')
        .update(data)
        .eq('id', memberId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating family member:", error);
      return false;
    }
  },

  async deleteFamilyMember(memberId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_family_members')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting family member:", error);
      return false;
    }
  }
};
