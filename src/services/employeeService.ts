import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errorHandler";

// Assuming these interfaces already exist in the file
export interface Employee {
  id: string;
  name: string;
  email: string;
  employee_id: string;
  organization_id: string;
  status: string;
  role: string;
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
}

// EmployeeWithDetails interface definition
export interface EmployeeWithDetails extends Employee {
  personalDetails?: EmployeePersonalDetails;
  identityAddress?: EmployeeIdentityAddress;
  employment?: EmployeeEmployment;
  family?: EmployeeFamily[];
  emergencyContacts?: EmployeeEmergencyContact[];
  education?: EmployeeEducation[];
  workExperience?: EmployeeWorkExperience[];
}

// Other interface definitions
export interface EmployeePersonalDetails {
  id: string;
  employee_id: string;
  gender?: string;
  religion?: string;
  marital_status?: string;
  birth_date?: string;
  birth_place?: string;
  mobile_phone?: string;
  blood_type?: string;
}

export interface EmployeeIdentityAddress {
  id: string;
  employee_id: string;
  nik?: string;
  passport_number?: string;
  passport_expiry?: string;
  postal_code?: string;
  citizen_address?: string;
  residential_address?: string;
}

export interface EmployeeEmployment {
  id: string;
  employee_id: string;
  organization?: string;
  barcode?: string;
  join_date?: string;
  sign_date?: string;
  branch?: string;
  employment_status?: string;
  job_level?: string;
  job_position?: string;
  grade?: string;
  class?: string;
  schedule?: string;
  approval_line?: string;
  manager_id?: string;
}

export interface EmployeeFamily {
  id: string;
  employee_id: string;
  name: string;
  relationship?: string;
  birth_date?: string;
  occupation?: string;
}

export interface EmployeeEmergencyContact {
  id: string;
  employee_id: string;
  name: string;
  relationship?: string;
  phone?: string;
  address?: string;
}

export interface EmployeeEducation {
  id: string;
  employee_id: string;
  education_type?: string;
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
}

export interface EmployeeWorkExperience {
  id: string;
  employee_id: string;
  company: string;
  position?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

class EmployeeService {
  // Existing methods would be here...
  async fetchEmployees(): Promise<EmployeeWithDetails[]> {
    try {
      const { data: employees, error: employeeError } = await supabase
        .from('employees')
        .select('*');

      if (employeeError) {
        throw employeeError;
      }

      if (!employees) {
        console.warn("No employees found.");
        return [];
      }

      const employeeDetailsPromises = employees.map(async (employee) => {
        const { data: personalDetails, error: personalDetailsError } = await supabase
          .from('employee_personal_details')
          .select('*')
          .eq('employee_id', employee.id)
          .single();

        if (personalDetailsError && personalDetailsError.code !== 'PGRST116') {
          console.error("Error fetching personal details:", personalDetailsError);
        }

        const { data: identityAddress, error: identityAddressError } = await supabase
          .from('employee_identity_addresses')
          .select('*')
          .eq('employee_id', employee.id)
          .single();

        if (identityAddressError && identityAddressError.code !== 'PGRST116') {
          console.error("Error fetching identity address:", identityAddressError);
        }

        const { data: employment, error: employmentError } = await supabase
          .from('employee_employment')
          .select('*')
          .eq('employee_id', employee.id)
          .single();

        if (employmentError && employmentError.code !== 'PGRST116') {
          console.error("Error fetching employment details:", employmentError);
        }

        const { data: family, error: familyError } = await supabase
          .from('employee_family')
          .select('*')
          .eq('employee_id', employee.id);

        if (familyError) {
          console.error("Error fetching family details:", familyError);
        }

        const { data: emergencyContacts, error: emergencyContactsError } = await supabase
          .from('employee_emergency_contacts')
          .select('*')
          .eq('employee_id', employee.id);

        if (emergencyContactsError) {
          console.error("Error fetching emergency contacts:", emergencyContactsError);
        }

        const { data: education, error: educationError } = await supabase
          .from('employee_education')
          .select('*')
          .eq('employee_id', employee.id);

        if (educationError) {
          console.error("Error fetching education:", educationError);
        }

        const { data: workExperience, error: workExperienceError } = await supabase
          .from('employee_work_experience')
          .select('*')
          .eq('employee_id', employee.id);

        if (workExperienceError) {
          console.error("Error fetching work experience:", workExperienceError);
        }

        return {
          ...employee,
          personalDetails: personalDetails || undefined,
          identityAddress: identityAddress || undefined,
          employment: employment || undefined,
          family: family || [],
          emergencyContacts: emergencyContacts || [],
          education: education || [],
          workExperience: workExperience || [],
        };
      });

      return Promise.all(employeeDetailsPromises);
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      handleError(error, "Failed to fetch employees");
      return [];
    }
  }

  async fetchEmployeeById(id: string): Promise<EmployeeWithDetails | null> {
    try {
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (employeeError) {
        if (employeeError.code === 'PGRST116') {
          console.warn(`Employee with id ${id} not found.`);
          return null;
        }
        throw employeeError;
      }

      if (!employee) {
        console.warn(`Employee with id ${id} not found.`);
        return null;
      }

      const { data: personalDetails, error: personalDetailsError } = await supabase
        .from('employee_personal_details')
        .select('*')
        .eq('employee_id', employee.id)
        .single();

      if (personalDetailsError && personalDetailsError.code !== 'PGRST116') {
        console.error("Error fetching personal details:", personalDetailsError);
      }

      const { data: identityAddress, error: identityAddressError } = await supabase
        .from('employee_identity_addresses')
        .select('*')
        .eq('employee_id', employee.id)
        .single();

      if (identityAddressError && identityAddressError.code !== 'PGRST116') {
        console.error("Error fetching identity address:", identityAddressError);
      }

      const { data: employment, error: employmentError } = await supabase
        .from('employee_employment')
        .select('*')
        .eq('employee_id', employee.id)
        .single();

      if (employmentError && employmentError.code !== 'PGRST116') {
        console.error("Error fetching employment details:", employmentError);
      }

      const { data: family, error: familyError } = await supabase
        .from('employee_family')
        .select('*')
        .eq('employee_id', employee.id);

      if (familyError) {
        console.error("Error fetching family details:", familyError);
      }

      const { data: emergencyContacts, error: emergencyContactsError } = await supabase
        .from('employee_emergency_contacts')
        .select('*')
        .eq('employee_id', employee.id);

      if (emergencyContactsError) {
        console.error("Error fetching emergency contacts:", emergencyContactsError);
      }

      const { data: education, error: educationError } = await supabase
        .from('employee_education')
        .select('*')
        .eq('employee_id', employee.id);

      if (educationError) {
        console.error("Error fetching education:", educationError);
      }

      const { data: workExperience, error: workExperienceError } = await supabase
        .from('employee_work_experience')
        .select('*')
        .eq('employee_id', employee.id);

      if (workExperienceError) {
        console.error("Error fetching work experience:", workExperienceError);
      }

      return {
        ...employee,
        personalDetails: personalDetails || undefined,
        identityAddress: identityAddress || undefined,
        employment: employment || undefined,
        family: family || [],
        emergencyContacts: emergencyContacts || [],
        education: education || [],
        workExperience: workExperience || [],
      };
    } catch (error: any) {
      console.error("Error fetching employee by ID:", error);
      handleError(error, "Failed to fetch employee by ID");
      return null;
    }
  }

  async createEmployee(
    employeeData: Partial<Employee>, 
    personalDetails?: any, 
    identityAddress?: any, 
    employment?: any
  ): Promise<EmployeeWithDetails | null> {
    try {
      // Ensure required fields are present
      if (!employeeData.name || !employeeData.email || !employeeData.employee_id || !employeeData.organization_id) {
        throw new Error("Name, email, employee_id, and organization_id are required");
      }

      // Insert employee data
      const { data, error } = await supabase
        .from('employees')
        .insert(employeeData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        console.error("Failed to create employee");
        return null;
      }

      // If additional details are provided, save them
      if (personalDetails && data.id) {
        personalDetails.employee_id = data.id;
        await this.savePersonalDetails(personalDetails);
      }

      if (identityAddress && data.id) {
        identityAddress.employee_id = data.id;
        await this.saveIdentityAddress(identityAddress);
      }

      if (employment && data.id) {
        employment.employee_id = data.id;
        await this.saveEmploymentDetails(employment);
      }

      return data as EmployeeWithDetails;
    } catch (error: any) {
      console.error("Error creating employee:", error);
      handleError(error, "Failed to create employee");
      return null;
    }
  }

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<EmployeeWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        console.warn(`Employee with id ${id} not found or not updated.`);
        return null;
      }

      return data as EmployeeWithDetails;
    } catch (error: any) {
      console.error("Error updating employee:", error);
      handleError(error, "Failed to update employee");
      return null;
    }
  }

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      handleError(error, "Failed to delete employee");
      return false;
    }
  }

  async uploadProfileImage(employeeId: string, file: File): Promise<string | null> {
    try {
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `profile_${timestamp}.${fileExt}`;
      const filePath = `employees/${employeeId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL instead of using protected storageUrl property
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const imageUrl = publicUrlData.publicUrl;
      
      // Update the employee record with the profile_image URL
      await this.updateEmployee(employeeId, { profile_image: imageUrl });

      return imageUrl;
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      handleError(error, "Failed to upload profile image");
      return null;
    }
  }

  // Add the missing family member methods
  async fetchFamilyMembers(employeeId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('employee_family')
        .select('*')
        .eq('employee_id', employeeId);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      console.error("Error fetching family members:", error);
      handleError(error, "Failed to fetch family members");
      return [];
    }
  }

  async saveFamilyMember(familyMember: any): Promise<any> {
    try {
      // If id exists, it's an update; otherwise, it's an insert
      const { id, ...familyData } = familyMember;
      
      const { data, error } = await supabase
        .from('employee_family')
        .upsert({ 
          ...(id ? { id } : {}), 
          ...familyData 
        }, {
          onConflict: 'id', 
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        throw error;
      }

      return data?.[0] || null;
    } catch (error: any) {
      console.error("Error saving family member:", error);
      handleError(error, "Failed to save family member");
      return null;
    }
  }

  async deleteFamilyMember(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_family')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Error deleting family member:", error);
      handleError(error, "Failed to delete family member");
      return false;
    }
  }

  // Renamed methods to match function calls in PersonalSection and other components
  async updateEmployeePersonalDetails(employeeId: string, details: any): Promise<any> {
    try {
      const personalDetails = {
        employee_id: employeeId,
        ...details
      };
      
      return this.savePersonalDetails(personalDetails);
    } catch (error) {
      this.handleError(error, 'Failed to update personal details');
      return null;
    }
  }

  async updateEmployeeEmployment(employeeId: string, details: any): Promise<any> {
    try {
      const employmentDetails = {
        employee_id: employeeId,
        ...details
      };
      
      return this.saveEmploymentDetails(employmentDetails);
    } catch (error) {
      this.handleError(error, 'Failed to update employment details');
      return null;
    }
  }

  async updateEmployeeIdentityAddress(employeeId: string, details: any): Promise<any> {
    try {
      console.log("Updating identity address for employee:", employeeId, details);
      const identityAddress = {
        employee_id: employeeId,
        ...details
      };
      
      return this.saveIdentityAddress(identityAddress);
    } catch (error) {
      this.handleError(error, 'Failed to update identity and address');
      return null;
    }
  }

  async saveEducation(education: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('employee_education')
        .upsert(education, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        throw error;
      }

      return data?.[0] || null;
    } catch (error) {
      this.handleError(error, 'Failed to save education data');
      return null;
    }
  }

  async deleteEducation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_education')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      this.handleError(error, 'Failed to delete education data');
      return false;
    }
  }

  async saveWorkExperience(experience: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('employee_work_experience')
        .upsert(experience, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        throw error;
      }

      return data?.[0] || null;
    } catch (error) {
      this.handleError(error, 'Failed to save work experience data');
      return null;
    }
  }

  async deleteWorkExperience(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_work_experience')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      this.handleError(error, 'Failed to delete work experience data');
      return false;
    }
  }

  // Method referenced in updatePersonalDetails
  async savePersonalDetails(personalDetails: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('employee_personal_details')
        .upsert(personalDetails, {
          onConflict: 'employee_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        throw error;
      }

      return data?.[0] || null;
    } catch (error) {
      this.handleError(error, 'Failed to save personal details data');
      return null;
    }
  }

  // Method referenced in updateEmploymentDetails
  async saveEmploymentDetails(employmentDetails: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('employee_employment')
        .upsert(employmentDetails, {
          onConflict: 'employee_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        throw error;
      }

      return data?.[0] || null;
    } catch (error) {
      this.handleError(error, 'Failed to save employment details data');
      return null;
    }
  }

  // Method referenced in updateIdentityAddress
  async saveIdentityAddress(identityAddress: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('employee_identity_addresses')
        .upsert(identityAddress, {
          onConflict: 'employee_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        throw error;
      }

      return data?.[0] || null;
    } catch (error) {
      this.handleError(error, 'Failed to save identity address data');
      return null;
    }
  }

  // Error handling method
  handleError(error: any, message: string): void {
    console.error(`${message}:`, error);
    handleError(error, message);
  }

  // Additional methods would follow...
}

export const employeeService = new EmployeeService();
