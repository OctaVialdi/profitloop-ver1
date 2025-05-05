
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
  mobile_phone?: string | null;
  birth_place?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  blood_type?: string | null;
  religion?: string | null;
  nik?: string | null;
  passport_number?: string | null;
  passport_expiry?: string | null;
  postal_code?: string | null;
  citizen_address?: string | null;
  address?: string | null; // residential address
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
  async fetchEmployees(): Promise<Employee[]> {
    try {
      // Fetch employee data
      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select("*");

      if (employeesError) throw employeesError;
      if (!employeesData) return [];

      return employeesData as Employee[];
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  },
  
  async fetchEmployeeById(id: string): Promise<Employee | null> {
    try {
      // Fetch the employee data
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single();
        
      if (employeeError) throw employeeError;
      if (!employeeData) return null;
      
      return employeeData as Employee;
    } catch (error) {
      console.error("Error fetching employee:", error);
      return null;
    }
  },

  // Add createEmployee function with consolidated data structure
  async createEmployee(
    employeeData: {
      name: string;
      organization_id: string;
      email?: string;
      role?: string;
      status?: string;
      employee_id?: string;
      profile_image?: string;
      mobile_phone?: string | null;
      birth_place?: string | null;
      birth_date?: string | null;
      gender?: string | null;
      marital_status?: string | null;
      religion?: string | null;
      blood_type?: string | null;
      nik?: string | null;
      passport_number?: string | null;
      passport_expiry?: string | null;
      postal_code?: string | null;
      citizen_address?: string | null;
      address?: string | null;
    }
  ): Promise<Employee | null> {
    try {
      // Insert all employee data at once
      const { data: newEmployee, error: employeeError } = await supabase
        .from("employees")
        .insert([employeeData])
        .select()
        .single();

      if (employeeError) throw employeeError;
      if (!newEmployee) return null;

      return newEmployee as Employee;
    } catch (error) {
      console.error("Error creating employee:", error);
      return null;
    }
  },

  // Update employee function with consolidated data structure
  async updateEmployee(
    id: string,
    data: Partial<Employee>
  ): Promise<Employee | null> {
    try {
      const { data: updatedEmployee, error } = await supabase
        .from("employees")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updatedEmployee as Employee;
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

  // Temporary implementation for family member (will need proper table later)
  async saveFamilyMember(
    familyMember: {
      employee_id: string;
      name: string; 
      relationship?: string | null;
      birth_date?: string | null;
      occupation?: string | null;
    }
  ): Promise<any | null> {
    try {
      // This is just a placeholder until we have a proper family table
      // For now, it just returns the data as if it was saved
      return { ...familyMember, id: "temp-id-" + Date.now() };
    } catch (error) {
      console.error("Error saving family member:", error);
      return null;
    }
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
