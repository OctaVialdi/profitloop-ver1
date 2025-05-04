import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Core employee types
export interface Employee {
  id: string;
  name: string;
  email?: string;
  role?: string;
  status?: string;
  employee_id?: string;
  profile_image?: string;
  organization_id: string;
}

export interface EmployeeBasic {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  employee_id?: string;
  profile_image?: string;
}

export interface EmployeePersonalDetails {
  mobile_phone?: string | null;
  birth_place?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  blood_type?: string | null;
  religion?: string | null;
}

export interface EmployeeIdentityAddress {
  nik?: string | null;
  passport_number?: string | null;
  passport_expiry?: string | null;
  postal_code?: string | null;
  citizen_address?: string | null;
  residential_address?: string | null;
}

export interface EmployeeEmployment {
  employee_id?: string | null;
  barcode?: string | null;
  organization?: string | null;
  job_position?: string | null;
  job_level?: string | null;
  employment_status?: string | null;
  branch?: string | null;
  join_date?: string | null;
  sign_date?: string | null;
  grade?: string | null;
  class?: string | null;
  schedule?: string | null;
  approval_line?: string | null;
  manager_id?: string | null;
}

export interface EmployeeWithDetails extends EmployeeBasic {
  personalDetails?: EmployeePersonalDetails;
  identityAddress?: EmployeeIdentityAddress;
  employment?: EmployeeEmployment;
  organization_id: string; 
}

// Additional types needed based on the errors
export interface EmployeeFamily {
  id?: string;
  employee_id: string;
  name: string;
  relationship?: string | null;
  birth_date?: string | null;
  occupation?: string | null;
}

export interface EmployeeEmergencyContact {
  id?: string;
  employee_id: string;
  name: string;
  relationship?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface EmployeeEducation {
  id?: string;
  employee_id: string;
  institution: string;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  education_type?: string | null;
}

export interface EmployeeWorkExperience {
  id?: string;
  employee_id: string;
  company: string;
  position?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
}

export const employeeService = {
  async fetchEmployees(): Promise<EmployeeWithDetails[]> {
    try {
      // Fetch basic employee data
      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select("*");

      if (employeesError) throw employeesError;
      if (!employeesData) return [];

      // For each employee, fetch their related data
      const employeesWithDetails = await Promise.all(
        employeesData.map(async (employee) => {
          const { data: personalData } = await supabase
            .from("employee_personal_details")
            .select("*")
            .eq("employee_id", employee.id)
            .single();

          const { data: identityData } = await supabase
            .from("employee_identity_addresses")
            .select("*")
            .eq("employee_id", employee.id)
            .single();

          const { data: employmentData } = await supabase
            .from("employee_employment")
            .select("*")
            .eq("employee_id", employee.id)
            .single();

          return {
            ...employee,
            personalDetails: personalData || undefined,
            identityAddress: identityData || undefined,
            employment: employmentData || undefined
          } as EmployeeWithDetails;
        })
      );

      return employeesWithDetails;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  },
  
  async fetchEmployeeById(id: string): Promise<EmployeeWithDetails | null> {
    try {
      // Fetch the basic employee data
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single();
        
      if (employeeError) throw employeeError;
      if (!employeeData) return null;
      
      // Fetch personal details
      const { data: personalData, error: personalError } = await supabase
        .from("employee_personal_details")
        .select("*")
        .eq("employee_id", id)
        .single();
        
      // Fetch identity and address
      const { data: identityData, error: identityError } = await supabase
        .from("employee_identity_addresses")
        .select("*")
        .eq("employee_id", id)
        .single();
        
      // Fetch employment data
      const { data: employmentData, error: employmentError } = await supabase
        .from("employee_employment")
        .select("*")
        .eq("employee_id", id)
        .single();
      
      // Construct the employee with details
      const employee: EmployeeWithDetails = {
        id: employeeData.id,
        name: employeeData.name,
        email: employeeData.email,
        role: employeeData.role,
        status: employeeData.status,
        employee_id: employeeData.employee_id,
        profile_image: employeeData.profile_image,
        organization_id: employeeData.organization_id, // Include organization_id
        personalDetails: personalData || undefined,
        identityAddress: identityData || undefined,
        employment: employmentData || undefined
      };
      
      return employee;
    } catch (error) {
      console.error("Error fetching employee:", error);
      return null;
    }
  },

  // Add createEmployee function
  async createEmployee(
    employeeData: {
      name: string;
      organization_id: string;
      email?: string;
      role?: string;
      status?: string;
      employee_id?: string;
      profile_image?: string;
    },
    personalDetails?: Partial<EmployeePersonalDetails>,
    identityAddress?: Partial<EmployeeIdentityAddress>,
    employment?: Partial<EmployeeEmployment>
  ): Promise<EmployeeWithDetails | null> {
    try {
      // Insert basic employee data - FIX: ensure name and organization_id are present
      const { data: newEmployee, error: employeeError } = await supabase
        .from("employees")
        .insert([employeeData]) // Changed from employeeData (Partial<Employee>) to ensure required fields
        .select()
        .single();

      if (employeeError) throw employeeError;
      if (!newEmployee) return null;

      // Insert personal details if provided
      if (personalDetails) {
        const { error: personalError } = await supabase
          .from("employee_personal_details")
          .insert([{ employee_id: newEmployee.id, ...personalDetails }]);

        if (personalError) throw personalError;
      }

      // Insert identity address if provided
      if (identityAddress) {
        const { error: identityError } = await supabase
          .from("employee_identity_addresses")
          .insert([{ employee_id: newEmployee.id, ...identityAddress }]);

        if (identityError) throw identityError;
      }

      // Insert employment data if provided
      if (employment) {
        const { error: employmentError } = await supabase
          .from("employee_employment")
          .insert([{ employee_id: newEmployee.id, ...employment }]);

        if (employmentError) throw employmentError;
      }

      // Fetch the newly created employee with all its details
      return await this.fetchEmployeeById(newEmployee.id);
    } catch (error) {
      console.error("Error creating employee:", error);
      return null;
    }
  },

  // Add updateEmployee function
  async updateEmployee(
    id: string,
    data: Partial<Employee>
  ): Promise<EmployeeWithDetails | null> {
    try {
      const { error } = await supabase
        .from("employees")
        .update(data)
        .eq("id", id);

      if (error) throw error;
      return await this.fetchEmployeeById(id);
    } catch (error) {
      console.error("Error updating employee:", error);
      return null;
    }
  },

  // Add deleteEmployee function
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting employee:", error);
      return false;
    }
  },

  // Add saveFamilyMember function - FIX: ensure required fields are present
  async saveFamilyMember(
    familyMember: {
      employee_id: string;
      name: string; 
      relationship?: string | null;
      birth_date?: string | null;
      occupation?: string | null;
    }
  ): Promise<EmployeeFamily | null> {
    try {
      const { data, error } = await supabase
        .from("employee_family")
        .insert([familyMember]) // Changed from array to ensure proper structure
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving family member:", error);
      return null;
    }
  }
};

export const updateEmployeePersonalDetails = async (
  employeeId: string, 
  data: Partial<EmployeePersonalDetails>
) => {
  try {
    // Check if the record exists first
    const { data: existingData, error: existingError } = await supabase
      .rpc('get_employee_personal_details', { employee_id_param: employeeId });
    
    if (existingError && existingError.code !== 'PGRST116') {
      // Real error, not just "no rows returned"
      throw existingError;
    }
    
    if (!existingData || existingData.length === 0) {
      // Record doesn't exist, insert new one
      const { error: insertError } = await supabase
        .from("employee_personal_details")
        .insert([{ 
          employee_id: employeeId,
          ...data
        }]);
      
      if (insertError) throw insertError;
    } else {
      // Record exists, update it
      const { error: updateError } = await supabase
        .from("employee_personal_details")
        .update(data)
        .eq("employee_id", employeeId);
      
      if (updateError) throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating employee personal details:", error);
    throw error;
  }
};

export const updateEmployeeIdentityAddress = async (
  employeeId: string, 
  data: Partial<EmployeeIdentityAddress>
) => {
  try {
    // Check if the record exists first
    const { data: existingData, error: existingError } = await supabase
      .rpc('get_employee_identity_address', { employee_id_param: employeeId });
    
    if (existingError && existingError.code !== 'PGRST116') {
      // Real error, not just "no rows returned"
      throw existingError;
    }
    
    if (!existingData || existingData.length === 0) {
      // Record doesn't exist, insert new one
      const { error: insertError } = await supabase
        .from("employee_identity_addresses")
        .insert([{ 
          employee_id: employeeId,
          ...data
        }]);
      
      if (insertError) throw insertError;
    } else {
      // Record exists, update it
      const { error: updateError } = await supabase
        .from("employee_identity_addresses")
        .update(data)
        .eq("employee_id", employeeId);
      
      if (updateError) throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating employee identity address:", error);
    throw error;
  }
};

export const updateEmployeeEmployment = async (
  employeeId: string, 
  data: Partial<EmployeeEmployment>
) => {
  try {
    // Check if the record exists first
    const { data: existingData, error: existingError } = await supabase
      .rpc('get_employee_employment', { employee_id_param: employeeId });
    
    if (existingError && existingError.code !== 'PGRST116') {
      // Real error, not just "no rows returned"
      throw existingError;
    }
    
    if (!existingData || existingData.length === 0) {
      // Record doesn't exist, insert new one
      const { error: insertError } = await supabase
        .from("employee_employment")
        .insert([{ 
          employee_id: employeeId,
          ...data
        }]);
      
      if (insertError) throw insertError;
    } else {
      // Record exists, update it
      const { error: updateError } = await supabase
        .from("employee_employment")
        .update(data)
        .eq("employee_id", employeeId);
      
      if (updateError) throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating employee employment:", error);
    throw error;
  }
};

export const updateEmployee = async (data: { id: string; [key: string]: any }) => {
  try {
    const { id, ...updateData } = data;
    const { error } = await supabase
      .from("employees")
      .update(updateData)
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// Add function to update employee profile image
export const updateEmployeeProfileImage = async (
  employeeId: string,
  imageFile: File
): Promise<string | null> => {
  try {
    // Create a unique file name
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${employeeId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('employee-photos')
      .upload(filePath, imageFile);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase
      .storage
      .from('employee-photos')
      .getPublicUrl(filePath);
    
    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }
    
    // Update the employee record with the new profile image URL
    const { error: updateError } = await supabase
      .from('employees')
      .update({ profile_image: urlData.publicUrl })
      .eq('id', employeeId);
    
    if (updateError) throw updateError;
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error updating employee profile image:', error);
    return null;
  }
};
