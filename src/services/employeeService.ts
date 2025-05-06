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
  
  // Additional field to store organization_name from employee_employment table
  organization_name?: string | null;
  
  // Reference to employment data when joined
  employment?: EmployeeEmployment[] | null;
}

// For backward compatibility with existing components
export interface EmployeeWithDetails extends Omit<Employee, 'employment'> {
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
  organization_name?: string | null;
  job_position?: string | null;
  job_level?: string | null;
  employment_status?: string | null;
  branch?: string | null;
  join_date?: string | null;
  sign_date?: string | null;
  company_name?: string | null;
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
      // Fetch employee data with a join to employee_employment to get organization_name
      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select(`
          *,
          employment:employee_employment(
            organization_name,
            barcode,
            job_position,
            job_level,
            employment_status,
            branch,
            join_date,
            sign_date
          )
        `);

      if (employeesError) throw employeesError;
      if (!employeesData) return [];

      // Process the joined data to include organization_name in the employee object
      return employeesData.map(employee => {
        // Get the employment data from the join result (it's an array but should only have one item)
        const employmentData = employee.employment && employee.employment.length > 0 
          ? employee.employment[0] 
          : null;

        // Create a new employee object with organization_name from employment data
        return {
          ...employee,
          organization_name: employmentData?.organization_name || null,
          barcode: employmentData?.barcode || null,
          job_position: employmentData?.job_position || null,
          job_level: employmentData?.job_level || null,
          employment_status: employmentData?.employment_status || null,
          branch: employmentData?.branch || null,
          join_date: employmentData?.join_date || null,
          sign_date: employmentData?.sign_date || null,
          // Keep the employment array for advanced use cases
          employment: employee.employment
        };
      }) as Employee[];
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
      
      // Fetch employment data
      const { data: employmentData } = await supabase
        .from("employee_employment")
        .select("*")
        .eq("employee_id", id)
        .maybeSingle();
        
      // Ensure we treat it as the correct type with all the fields we need
      const employeeWithAllFields = {
        ...employeeData,
        organization_name: employmentData?.organization_name || null,
        barcode: employmentData?.barcode || null,
        job_position: employmentData?.job_position || null,
        job_level: employmentData?.job_level || null,
        employment_status: employmentData?.employment_status || null,
        branch: employmentData?.branch || null,
        join_date: employmentData?.join_date || null,
        sign_date: employmentData?.sign_date || null
      } as Employee;
      
      // For backward compatibility, create an EmployeeWithDetails structure
      const employeeWithDetails: EmployeeWithDetails = {
        ...employeeWithAllFields,
        personalDetails: {
          employee_id: employeeWithAllFields.employee_id,
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
        employment: employmentData || {
          employee_id: employeeWithAllFields.id,
          barcode: employeeWithAllFields.barcode,
          organization_name: employeeWithAllFields.organization_name,
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
      employee_id?: string; // Make sure we can save the employee_id
      email?: string;
      role?: string;
      status?: string;
      profile_image?: string;
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
      address?: string | null;
      // Employment fields
      barcode?: string | null;
      job_position?: string | null;
      job_level?: string | null;
      employment_status?: string | null;
      branch?: string | null;
      join_date?: string | null;
      sign_date?: string | null;
      organization_name?: string | null;
    }
  ): Promise<Employee | null> {
    try {
      console.log("Creating employee with data:", employeeData);
      
      // Make a copy of the data without employment-specific fields
      const { 
        organization_name, 
        barcode, 
        job_position, 
        job_level, 
        employment_status, 
        branch,
        join_date,
        sign_date,
        ...employeeOnlyData 
      } = employeeData;
      
      // If no employee_id is provided, generate one
      if (!employeeOnlyData.employee_id) {
        employeeOnlyData.employee_id = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      }
      
      // Insert employee data
      const { data: newEmployee, error: employeeError } = await supabase
        .from("employees")
        .insert(employeeOnlyData)
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

      // If we have employment data, create an employment record
      if (newEmployee.id && (organization_name || barcode || job_position || job_level || employment_status || branch || join_date || sign_date)) {
        const employmentData = {
          employee_id: newEmployee.id,
          organization_name,
          barcode,
          job_position,
          job_level,
          employment_status,
          branch,
          join_date,
          sign_date
        };
        
        const { error: employmentError } = await supabase
          .from("employee_employment")
          .insert(employmentData);
          
        if (employmentError) {
          console.error("Error creating employment data:", employmentError);
          // We'll continue since the employee was created successfully
        }
      }

      console.log("Employee created successfully:", newEmployee);
      
      // Include the organization_name in the returned data
      return {
        ...newEmployee,
        organization_name
      } as Employee;
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
    const filePath = `${employeeId}/${fileName}`;
    
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
    
    // Also update the organization_name in employee_employment table if provided
    if (data.organization_name) {
      await createOrUpdateEmployeeEmployment(employeeId, {
        organization_name: data.organization_name
      });
    }
    
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
      .select('*')
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
      .select()
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
      .select()
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

// Add these functions to work with the employee_employment table
export const getEmployeeEmploymentData = async (employeeId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('employee_employment')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (error) {
      console.error("Error fetching employee employment data:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch employee employment data:", error);
    return null;
  }
};

export const createOrUpdateEmployeeEmployment = async (
  employeeId: string,
  data: {
    barcode?: string | null;
    company_name?: string | null;
    organization_name?: string | null;
    job_position?: string | null;
    job_level?: string | null;
    employment_status?: string | null;
    branch?: string | null;
    join_date?: string | null;
    sign_date?: string | null;
  }
): Promise<boolean> => {
  try {
    console.log("Updating employee employment data:", employeeId, data);
    
    // Check if employment record already exists
    const { data: existingData, error: fetchError } = await supabase
      .from('employee_employment')
      .select('id')
      .eq('employee_id', employeeId)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error("Error checking for existing employment record:", fetchError);
      throw fetchError;
    }
    
    if (existingData) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('employee_employment')
        .update(data)
        .eq('employee_id', employeeId);
      
      if (updateError) {
        console.error("Error updating employment data:", updateError);
        throw updateError;
      }
    } else {
      // Create new record with employee_id
      const { error: insertError } = await supabase
        .from('employee_employment')
        .insert([{ 
          employee_id: employeeId,
          ...data 
        }]);
      
      if (insertError) {
        console.error("Error creating employment data:", insertError);
        throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error saving employee employment data:", error);
    return false;
  }
};

// Add dummyEmployees function for testing purposes
export const addDummyEmployees = async (): Promise<boolean> => {
  try {
    // Generate unique employee IDs for new employees
    const generateUniqueId = () => `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create first employee
    const employee1 = {
      name: "John Doe",
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
      organization_id: "96b17df8-c3c3-4ace-a622-0e3c1f5b6500",
      employee_id: generateUniqueId()
    };
    
    const employee1Result = await employeeService.createEmployee(employee1);
      
    if (employee1Result) {
      // Add employment data for first employee
      await createOrUpdateEmployeeEmployment(employee1Result.id, {
        organization_name: "Sales Department",
        job_position: "Staff",
        job_level: "Junior",
        employment_status: "Permanent"
      });
    }
    
    // Create second employee
    const employee2 = {
      name: "Jane Smith",
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
      organization_id: "96b17df8-c3c3-4ace-a622-0e3c1f5b6500",
      employee_id: generateUniqueId()
    };
    
    const employee2Result = await employeeService.createEmployee(employee2);
      
    if (employee2Result) {
      // Add employment data for second employee
      await createOrUpdateEmployeeEmployment(employee2Result.id, {
        organization_name: "Marketing Department",
        job_position: "Manager",
        job_level: "Senior",
        employment_status: "Permanent"
      });
    }
    
    return !!(employee1Result && employee2Result);
  } catch (error) {
    console.error("Error adding dummy employees:", error);
    throw error;
  }
};
