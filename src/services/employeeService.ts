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

  // Employment fields (these would be in the database eventually)
  barcode?: string | null;
  job_position?: string | null;
  job_level?: string | null;
  employment_status?: string | null;
  branch?: string | null;
  join_date?: string | null;
  sign_date?: string | null;
}

// For backward compatibility with existing components
export interface EmployeeWithDetails extends Employee {
  personalDetails?: EmployeePersonalDetails;
  identityAddress?: EmployeeIdentityAddress;
  employment?: EmployeeEmployment;
}

export interface EmployeePersonalDetails {
  employee_id?: string;
  mobile_phone?: string | null;
  birth_place?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  blood_type?: string | null;
  religion?: string | null;
}

export interface EmployeeIdentityAddress {
  employee_id?: string;
  nik?: string | null;
  passport_number?: string | null;
  passport_expiry?: string | null;
  postal_code?: string | null;
  citizen_address?: string | null;
  residential_address?: string | null;
}

export interface EmployeeEmployment {
  employee_id?: string;
  barcode?: string | null;
  organization?: string | null;
  job_position?: string | null;
  job_level?: string | null;
  employment_status?: string | null;
  branch?: string | null;
  join_date?: string | null;
  sign_date?: string | null;
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
  age?: number | null;
  occupation?: string | null;
  phone?: string | null;
  address?: string | null;
  gender?: string | null;
  is_emergency_contact?: boolean;
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
  
  async fetchEmployeeById(id: string): Promise<EmployeeWithDetails | null> {
    try {
      // Fetch the employee data
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single();
        
      if (employeeError) throw employeeError;
      if (!employeeData) return null;
      
      // Ensure we treat it as the correct type with all the fields we need
      const employeeWithAllFields = employeeData as unknown as Employee;
      
      // For backward compatibility, create an EmployeeWithDetails structure
      const employeeWithDetails: EmployeeWithDetails = {
        ...employeeWithAllFields,
        personalDetails: {
          mobile_phone: employeeWithAllFields.mobile_phone,
          birth_place: employeeWithAllFields.birth_place,
          birth_date: employeeWithAllFields.birth_date,
          gender: employeeWithAllFields.gender,
          marital_status: employeeWithAllFields.marital_status,
          blood_type: employeeWithAllFields.blood_type,
          religion: employeeWithAllFields.religion
        },
        identityAddress: {
          nik: employeeWithAllFields.nik,
          passport_number: employeeWithAllFields.passport_number,
          passport_expiry: employeeWithAllFields.passport_expiry,
          postal_code: employeeWithAllFields.postal_code,
          citizen_address: employeeWithAllFields.citizen_address,
          residential_address: employeeWithAllFields.address
        },
        employment: {
          employee_id: employeeWithAllFields.employee_id,
          barcode: employeeWithAllFields.barcode,
          job_position: employeeWithAllFields.job_position,
          job_level: employeeWithAllFields.job_level,
          employment_status: employeeWithAllFields.employment_status,
          branch: employeeWithAllFields.branch,
          join_date: employeeWithAllFields.join_date,
          sign_date: employeeWithAllFields.sign_date
        }
      };
      
      return employeeWithDetails;
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
      // Employment fields
      barcode?: string | null;
      job_position?: string | null;
      job_level?: string | null;
      employment_status?: string | null;
      branch?: string | null;
      join_date?: string | null;
      sign_date?: string | null;
    }
  ): Promise<Employee | null> {
    try {
      console.log("Creating employee with data:", employeeData);
      
      // Insert all employee data at once
      const { data: newEmployee, error: employeeError } = await supabase
        .from("employees")
        .insert([employeeData])
        .select()
        .single();

      if (employeeError) {
        console.error("Supabase error during employee creation:", employeeError);
        throw new Error(`Database error: ${employeeError.message}`);
      }
      
      if (!newEmployee) {
        console.error("No employee data returned after insertion");
        throw new Error("Failed to create employee: No data returned");
      }

      console.log("Employee created successfully:", newEmployee);
      return newEmployee as Employee;
    } catch (error) {
      console.error("Error creating employee in service:", error);
      throw error; // Re-throw to handle in the component
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
  ): Promise<EmployeeFamily | null> {
    try {
      // This is just a placeholder until we have a proper family table
      // For now, it just returns the data as if it was saved
      return { ...familyMember, id: "temp-id-" + Date.now() };
    } catch (error) {
      console.error("Error saving family member:", error);
      return null;
    }
  },
  
  // Get family members for an employee - placeholder implementation
  async getFamilyMembers(employeeId: string): Promise<EmployeeFamily[]> {
    try {
      // This is just a placeholder until we have a proper family table
      // For now, it returns an empty array
      return [];
    } catch (error) {
      console.error("Error fetching family members:", error);
      return [];
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

// Add these wrapper functions to handle updating specific parts of employee data
export const updateEmployeePersonalDetails = async (
  employeeId: string,
  data: Partial<EmployeePersonalDetails>
): Promise<boolean> => {
  try {
    // Map data from EmployeePersonalDetails to Employee
    const employeeData: Partial<Employee> = {
      mobile_phone: data.mobile_phone,
      birth_place: data.birth_place,
      birth_date: data.birth_date,
      gender: data.gender,
      marital_status: data.marital_status,
      blood_type: data.blood_type,
      religion: data.religion
    };
    
    const result = await employeeService.updateEmployee(employeeId, employeeData);
    return !!result;
  } catch (error) {
    console.error("Error updating employee personal details:", error);
    return false;
  }
};

export const updateEmployeeIdentityAddress = async (
  employeeId: string,
  data: Partial<EmployeeIdentityAddress>
): Promise<boolean> => {
  try {
    // Map data from EmployeeIdentityAddress to Employee
    const employeeData: Partial<Employee> = {
      nik: data.nik,
      passport_number: data.passport_number,
      passport_expiry: data.passport_expiry,
      postal_code: data.postal_code,
      citizen_address: data.citizen_address,
      address: data.residential_address
    };
    
    const result = await employeeService.updateEmployee(employeeId, employeeData);
    return !!result;
  } catch (error) {
    console.error("Error updating employee identity address:", error);
    return false;
  }
};

export const updateEmployeeEmployment = async (
  employeeId: string,
  data: Partial<EmployeeEmployment>
): Promise<boolean> => {
  try {
    // Map data from EmployeeEmployment to Employee
    const employeeData: Partial<Employee> = {
      employee_id: data.employee_id,
      barcode: data.barcode,
      job_position: data.job_position,
      job_level: data.job_level,
      employment_status: data.employment_status,
      branch: data.branch,
      join_date: data.join_date,
      sign_date: data.sign_date
    };
    
    const result = await employeeService.updateEmployee(employeeId, employeeData);
    return !!result;
  } catch (error) {
    console.error("Error updating employee employment:", error);
    return false;
  }
};

// Add function to update employee basic information (name, email)
export const updateEmployeeBasicInfo = async (
  employeeId: string,
  data: { name?: string; email?: string }
): Promise<boolean> => {
  try {
    console.log("Updating employee basic info:", data);
    
    // Update the employee record with the new basic info
    const { error } = await supabase
      .from('employees')
      .update({
        name: data.name,
        email: data.email
      })
      .eq('id', employeeId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating employee basic info:', error);
    return false;
  }
};

// Add these functions for the family members CRUD operations with improved error handling
export const getFamilyMembers = async (employeeId: string): Promise<EmployeeFamily[]> => {
  try {
    console.log("Fetching family members for employee:", employeeId);
    
    const { data, error } = await supabase
      .from('employee_family_members')
      .select('employee_family_members.*')  // Fix: Use explicit table name in select
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching family members:', error);
      throw error;
    }
    
    console.log("Retrieved family members:", data);
    return data || [];
  } catch (error) {
    console.error('Error fetching family members:', error);
    return [];
  }
};

export const addFamilyMember = async (familyMember: EmployeeFamily): Promise<EmployeeFamily | null> => {
  try {
    console.log("Adding family member:", familyMember);
    
    // Use explicit table name for the employee_id column to avoid ambiguity
    const { data, error } = await supabase
      .from('employee_family_members')
      .insert([{
        employee_id: familyMember.employee_id,
        name: familyMember.name,
        relationship: familyMember.relationship,
        age: familyMember.age,
        occupation: familyMember.occupation,
        phone: familyMember.phone,
        address: familyMember.address,
        gender: familyMember.gender,
        is_emergency_contact: familyMember.is_emergency_contact
      }])
      .select('employee_family_members.*')  // Fix: Use explicit table name in select
      .single();

    if (error) {
      console.error('Error adding family member:', error);
      throw error;
    }
    
    console.log("Family member added successfully:", data);
    return data;
  } catch (error) {
    console.error('Error adding family member:', error);
    throw error;
  }
};

export const updateFamilyMember = async (id: string, updates: Partial<EmployeeFamily>): Promise<EmployeeFamily | null> => {
  try {
    console.log("Updating family member:", id, updates);
    
    const { data, error } = await supabase
      .from('employee_family_members')
      .update(updates)
      .eq('id', id)
      .select('employee_family_members.*')  // Fix: Use explicit table name in select
      .single();

    if (error) {
      console.error('Error updating family member:', error);
      throw error;
    }
    
    console.log("Family member updated successfully:", data);
    return data;
  } catch (error) {
    console.error('Error updating family member:', error);
    throw error;
  }
};

export const deleteFamilyMember = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting family member:", id);
    
    const { error } = await supabase
      .from('employee_family_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting family member:', error);
      throw error;
    }
    
    console.log("Family member deleted successfully");
    return true;
  } catch (error) {
    console.error('Error deleting family member:', error);
    return false;
  }
};
