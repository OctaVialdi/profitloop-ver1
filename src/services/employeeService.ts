import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  // Other sections can be added here as needed
}

export const employeeService = {
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
        personalDetails: personalData || undefined,
        identityAddress: identityData || undefined,
        employment: employmentData || undefined
      };
      
      return employee;
    } catch (error) {
      console.error("Error fetching employee:", error);
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
      .from("employee_personal_details")
      .select("*")
      .eq("employee_id", employeeId)
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      // Real error, not just "no rows returned"
      throw existingError;
    }
    
    if (!existingData) {
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
      .from("employee_identity_addresses")
      .select("*")
      .eq("employee_id", employeeId)
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      // Real error, not just "no rows returned"
      throw existingError;
    }
    
    if (!existingData) {
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
      .from("employee_employment")
      .select("*")
      .eq("employee_id", employeeId)
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      // Real error, not just "no rows returned"
      throw existingError;
    }
    
    if (!existingData) {
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
