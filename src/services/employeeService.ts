import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Employee {
  id: string;
  organization_id: string;
  employee_id: string;
  name: string;
  email: string;
  status: string;
  role: string;
}

export interface EmployeePersonalDetails {
  id?: string;
  employee_id: string;
  mobile_phone?: string;
  birth_place?: string;
  birth_date?: string | null;
  gender?: string;
  marital_status?: string;
  religion?: string;
  blood_type?: string;
}

export interface EmployeeIdentityAddress {
  id?: string;
  employee_id: string;
  nik?: string;
  passport_number?: string;
  passport_expiry?: string | null;
  postal_code?: string;
  citizen_address?: string;
  residential_address?: string;
}

export interface EmployeeEmployment {
  id?: string;
  employee_id: string;
  barcode?: string;
  organization?: string;
  job_position?: string;
  job_level?: string;
  employment_status?: string;
  branch?: string;
  join_date?: string | null;
  sign_date?: string | null;
  grade?: string;
  class?: string;
  schedule?: string;
  approval_line?: string;
  manager_id?: string | null;
}

export interface EmployeeWithDetails {
  id: string;
  organization_id: string;
  employee_id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  personalDetails?: EmployeePersonalDetails;
  identityAddress?: EmployeeIdentityAddress;
  employment?: EmployeeEmployment;
}

export interface EmployeeFamily {
  id?: string;
  employee_id: string;
  name: string;
  relationship?: string;
  birth_date?: string | null;
  occupation?: string;
}

export interface EmployeeEmergencyContact {
  id?: string;
  employee_id: string;
  name: string;
  relationship?: string;
  phone?: string;
  address?: string;
}

export interface EmployeeEducation {
  id?: string;
  employee_id: string;
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string | null;
  end_date?: string | null;
  education_type?: string;
}

export interface EmployeeWorkExperience {
  id?: string;
  employee_id: string;
  company: string;
  position?: string;
  description?: string;
  start_date?: string | null;
  end_date?: string | null;
}

// Helper function to convert dates to ISO strings
const formatDateFields = (obj: any): any => {
  if (!obj) return obj;
  
  const result = { ...obj };
  
  // Process date fields
  Object.keys(result).forEach(key => {
    if (result[key] instanceof Date) {
      result[key] = result[key].toISOString();
    }
  });
  
  return result;
};

class EmployeeService {
  async fetchEmployees(): Promise<EmployeeWithDetails[]> {
    try {
      const { data: employees, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
      
      // Get personal details and employment info for each employee
      const employeesWithDetails = await Promise.all(
        employees.map(async (employee) => {
          const personalDetails = await this.fetchPersonalDetails(employee.id);
          const identityAddress = await this.fetchIdentityAddress(employee.id);
          const employment = await this.fetchEmployment(employee.id);
          
          return {
            ...employee,
            personalDetails: personalDetails[0] || undefined,
            identityAddress: identityAddress[0] || undefined,
            employment: employment[0] || undefined,
          };
        })
      );
      
      return employeesWithDetails;
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast.error('Failed to load employee data');
      return [];
    }
  }
  
  async fetchEmployeeById(id: string): Promise<EmployeeWithDetails | null> {
    try {
      const { data: employee, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching employee:', error);
        throw error;
      }
      
      const personalDetails = await this.fetchPersonalDetails(id);
      const identityAddress = await this.fetchIdentityAddress(id);
      const employment = await this.fetchEmployment(id);
      
      return {
        ...employee,
        personalDetails: personalDetails[0] || undefined,
        identityAddress: identityAddress[0] || undefined,
        employment: employment[0] || undefined,
      };
    } catch (error) {
      console.error('Failed to fetch employee:', error);
      toast.error('Failed to load employee data');
      return null;
    }
  }
  
  // Personal Details
  async fetchPersonalDetails(employeeId: string): Promise<EmployeePersonalDetails[]> {
    try {
      const { data, error } = await supabase
        .from('employee_personal_details')
        .select('*')
        .eq('employee_id', employeeId);
        
      if (error) {
        console.error('Error fetching personal details:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch personal details:', error);
      return [];
    }
  }
  
  async savePersonalDetails(details: EmployeePersonalDetails): Promise<EmployeePersonalDetails | null> {
    try {
      // Format date fields
      const formattedDetails = formatDateFields(details);
      console.log("Saving personal details:", formattedDetails);
      
      // Check if there's an existing record using table name alias
      const { data: existingDetails, error: queryError } = await supabase
        .from('employee_personal_details')
        .select('id')
        .eq('employee_id', formattedDetails.employee_id);
      
      if (queryError) {
        console.error("Error querying personal details:", queryError);
        throw queryError;
      }
      
      let result;
      
      if (existingDetails && existingDetails.length > 0) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_personal_details')
          .update({
            mobile_phone: formattedDetails.mobile_phone,
            birth_place: formattedDetails.birth_place,
            birth_date: formattedDetails.birth_date,
            gender: formattedDetails.gender,
            marital_status: formattedDetails.marital_status,
            religion: formattedDetails.religion,
            blood_type: formattedDetails.blood_type
          })
          .eq('id', existingDetails[0].id)
          .select('*')
          .single();
          
        if (error) {
          console.error("Error updating personal details:", error);
          throw error;
        }
        result = data;
      } else {
        // Create new record
        console.log("Inserting new personal details:", formattedDetails);
        const { data, error } = await supabase
          .from('employee_personal_details')
          .insert({
            employee_id: formattedDetails.employee_id,
            mobile_phone: formattedDetails.mobile_phone,
            birth_place: formattedDetails.birth_place,
            birth_date: formattedDetails.birth_date,
            gender: formattedDetails.gender,
            marital_status: formattedDetails.marital_status,
            religion: formattedDetails.religion,
            blood_type: formattedDetails.blood_type
          })
          .select('*')
          .single();
          
        if (error) {
          console.error("Error inserting personal details:", error);
          throw error;
        }
        result = data;
      }
      
      console.log("Personal details saved successfully:", result);
      return result;
    } catch (error) {
      console.error('Failed to save personal details:', error);
      toast.error('Failed to save personal details');
      return null;
    }
  }
  
  // Identity & Address
  async fetchIdentityAddress(employeeId: string): Promise<EmployeeIdentityAddress[]> {
    try {
      const { data, error } = await supabase
        .from('employee_identity_addresses')
        .select('*')
        .eq('employee_id', employeeId);
        
      if (error) {
        console.error('Error fetching identity address:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch identity address:', error);
      return [];
    }
  }
  
  async saveIdentityAddress(details: EmployeeIdentityAddress): Promise<EmployeeIdentityAddress | null> {
    try {
      // Format date fields
      const formattedDetails = formatDateFields(details);
      console.log("Saving identity address:", formattedDetails);
      
      // Check if there's an existing record
      const { data: existingDetails, error: queryError } = await supabase
        .from('employee_identity_addresses')
        .select('id')
        .eq('employee_id', formattedDetails.employee_id);
      
      if (queryError) {
        console.error("Error querying identity address:", queryError);
        throw queryError;
      }
      
      let result;
      
      if (existingDetails && existingDetails.length > 0) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_identity_addresses')
          .update({
            nik: formattedDetails.nik,
            passport_number: formattedDetails.passport_number,
            passport_expiry: formattedDetails.passport_expiry,
            postal_code: formattedDetails.postal_code,
            citizen_address: formattedDetails.citizen_address,
            residential_address: formattedDetails.residential_address
          })
          .eq('id', existingDetails[0].id)
          .select('*')
          .single();
          
        if (error) {
          console.error("Error updating identity address:", error);
          throw error;
        }
        result = data;
      } else {
        // Create new record
        console.log("Inserting new identity address:", formattedDetails);
        const { data, error } = await supabase
          .from('employee_identity_addresses')
          .insert({
            employee_id: formattedDetails.employee_id,
            nik: formattedDetails.nik,
            passport_number: formattedDetails.passport_number,
            passport_expiry: formattedDetails.passport_expiry,
            postal_code: formattedDetails.postal_code,
            citizen_address: formattedDetails.citizen_address,
            residential_address: formattedDetails.residential_address
          })
          .select('*')
          .single();
          
        if (error) {
          console.error("Error inserting identity address:", error);
          throw error;
        }
        result = data;
      }
      
      console.log("Identity address saved successfully:", result);
      return result;
    } catch (error) {
      console.error('Failed to save identity & address:', error);
      toast.error('Failed to save identity & address');
      return null;
    }
  }
  
  // Employment
  async fetchEmployment(employeeId: string): Promise<EmployeeEmployment[]> {
    try {
      const { data, error } = await supabase
        .from('employee_employment')
        .select('*')
        .eq('employee_id', employeeId);
        
      if (error) {
        console.error('Error fetching employment details:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch employment details:', error);
      return [];
    }
  }
  
  async saveEmployment(details: EmployeeEmployment): Promise<EmployeeEmployment | null> {
    try {
      // Format date fields
      const formattedDetails = formatDateFields(details);
      console.log("Saving employment details:", formattedDetails);
      
      // Check if there's an existing record
      const { data: existingDetails, error: queryError } = await supabase
        .from('employee_employment')
        .select('id')
        .eq('employee_id', formattedDetails.employee_id);
      
      if (queryError) {
        console.error("Error querying employment details:", queryError);
        throw queryError;
      }
      
      let result;
      
      if (existingDetails && existingDetails.length > 0) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_employment')
          .update({
            barcode: formattedDetails.barcode,
            organization: formattedDetails.organization,
            job_position: formattedDetails.job_position,
            job_level: formattedDetails.job_level,
            employment_status: formattedDetails.employment_status,
            branch: formattedDetails.branch,
            join_date: formattedDetails.join_date,
            sign_date: formattedDetails.sign_date,
            grade: formattedDetails.grade,
            class: formattedDetails.class,
            schedule: formattedDetails.schedule,
            approval_line: formattedDetails.approval_line,
            manager_id: formattedDetails.manager_id
          })
          .eq('id', existingDetails[0].id)
          .select('*')
          .single();
          
        if (error) {
          console.error("Error updating employment details:", error);
          throw error;
        }
        result = data;
      } else {
        // Create new record
        console.log("Inserting new employment details:", formattedDetails);
        const { data, error } = await supabase
          .from('employee_employment')
          .insert({
            employee_id: formattedDetails.employee_id,
            barcode: formattedDetails.barcode,
            organization: formattedDetails.organization,
            job_position: formattedDetails.job_position,
            job_level: formattedDetails.job_level,
            employment_status: formattedDetails.employment_status,
            branch: formattedDetails.branch,
            join_date: formattedDetails.join_date,
            sign_date: formattedDetails.sign_date,
            grade: formattedDetails.grade,
            class: formattedDetails.class,
            schedule: formattedDetails.schedule,
            approval_line: formattedDetails.approval_line,
            manager_id: formattedDetails.manager_id
          })
          .select('*')
          .single();
          
        if (error) {
          console.error("Error inserting employment details:", error);
          throw error;
        }
        result = data;
      }
      
      console.log("Employment details saved successfully:", result);
      return result;
    } catch (error) {
      console.error('Failed to save employment:', error);
      toast.error('Failed to save employment');
      return null;
    }
  }
  
  // Create new employee with all basic details
  async createEmployee(
    employeeData: Partial<Employee>, 
    personalDetails?: Partial<EmployeePersonalDetails>,
    identityAddress?: Partial<EmployeeIdentityAddress>,
    employment?: Partial<EmployeeEmployment>
  ): Promise<EmployeeWithDetails | null> {
    try {
      // Get organization_id from profile
      const { data: profileData } = await supabase.auth.getUser();
      
      if (!profileData?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      const { data: profileResult } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', profileData.user.id)
        .single();
        
      if (!profileResult?.organization_id) {
        throw new Error('User has no organization');
      }
      
      // Check if employee with same employee_id exists
      if (employeeData.employee_id) {
        const { data: existingEmployee } = await supabase
          .from('employees')
          .select('id')
          .eq('organization_id', profileResult.organization_id)
          .eq('employee_id', employeeData.employee_id)
          .maybeSingle();
        
        if (existingEmployee) {
          // Generate a unique employee_id with random suffix
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          employeeData.employee_id = `${employeeData.employee_id}-${randomSuffix}`;
          console.log(`Employee ID already exists, using new ID: ${employeeData.employee_id}`);
        }
      }
      
      // Generate employee ID if not provided
      if (!employeeData.employee_id) {
        employeeData.employee_id = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      }
      
      // Create base employee record with required name
      const employeeToCreate = {
        ...employeeData,
        name: employeeData.name || 'New Employee', // Ensure name is always provided
        organization_id: profileResult.organization_id
      };
      
      console.log("Creating employee with data:", employeeToCreate);
      
      // Create base employee record
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .insert(employeeToCreate)
        .select('*')
        .single();
        
      if (employeeError) {
        console.error("Error creating employee:", employeeError);
        throw employeeError;
      }
      
      console.log("Base employee created:", employee);
      
      // Create related records one by one with proper error handling
      let savedPersonalDetails = null;
      let savedIdentityAddress = null;
      let savedEmployment = null;
      
      // Save personal details if provided
      if (personalDetails) {
        try {
          const personalDetailsWithEmployeeId = {
            ...personalDetails,
            employee_id: employee.id
          };
          console.log("Saving personal details:", personalDetailsWithEmployeeId);
          savedPersonalDetails = await this.savePersonalDetails(personalDetailsWithEmployeeId as EmployeePersonalDetails);
        } catch (error) {
          console.error("Error saving personal details:", error);
        }
      }
      
      // Save identity address if provided
      if (identityAddress) {
        try {
          const identityAddressWithEmployeeId = {
            ...identityAddress,
            employee_id: employee.id
          };
          console.log("Saving identity address:", identityAddressWithEmployeeId);
          savedIdentityAddress = await this.saveIdentityAddress(identityAddressWithEmployeeId as EmployeeIdentityAddress);
        } catch (error) {
          console.error("Error saving identity address:", error);
        }
      }
      
      // Save employment details if provided
      if (employment) {
        try {
          const employmentWithEmployeeId = {
            ...employment,
            employee_id: employee.id
          };
          console.log("Saving employment details:", employmentWithEmployeeId);
          savedEmployment = await this.saveEmployment(employmentWithEmployeeId as EmployeeEmployment);
        } catch (error) {
          console.error("Error saving employment details:", error);
        }
      }
      
      // Return the complete employee object
      return {
        ...employee,
        personalDetails: savedPersonalDetails || undefined,
        identityAddress: savedIdentityAddress || undefined,
        employment: savedEmployment || undefined
      };
      
    } catch (error) {
      console.error('Failed to create employee:', error);
      throw new Error('Failed to create employee: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  // Update employee
  async updateEmployee(
    id: string,
    employeeData: Partial<Employee>,
    personalDetails?: Partial<EmployeePersonalDetails>,
    identityAddress?: Partial<EmployeeIdentityAddress>,
    employment?: Partial<EmployeeEmployment>
  ): Promise<EmployeeWithDetails | null> {
    try {
      // Update base employee record
      const { error: employeeError } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', id);
        
      if (employeeError) throw employeeError;
      
      // Update related records
      let savedPersonalDetails = null;
      let savedIdentityAddress = null;
      let savedEmployment = null;
      
      if (personalDetails) {
        try {
          savedPersonalDetails = await this.savePersonalDetails({
            ...personalDetails,
            employee_id: id
          } as EmployeePersonalDetails);
        } catch (error) {
          console.error("Error updating personal details:", error);
        }
      }
      
      if (identityAddress) {
        try {
          savedIdentityAddress = await this.saveIdentityAddress({
            ...identityAddress,
            employee_id: id
          } as EmployeeIdentityAddress);
        } catch (error) {
          console.error("Error updating identity address:", error);
        }
      }
      
      if (employment) {
        try {
          savedEmployment = await this.saveEmployment({
            ...employment,
            employee_id: id
          } as EmployeeEmployment);
        } catch (error) {
          console.error("Error updating employment details:", error);
        }
      }
      
      // Return the updated employee with details
      return this.fetchEmployeeById(id);
      
    } catch (error) {
      console.error('Failed to update employee:', error);
      toast.error('Failed to update employee');
      return null;
    }
  }
  
  // Delete employee
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Failed to delete employee:', error);
      toast.error('Failed to delete employee');
      return false;
    }
  }
  
  // Family members
  async fetchFamilyMembers(employeeId: string): Promise<EmployeeFamily[]> {
    try {
      const { data, error } = await supabase
        .from('employee_family')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at');
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch family members:', error);
      return [];
    }
  }
  
  async saveFamilyMember(member: EmployeeFamily): Promise<EmployeeFamily | null> {
    try {
      // Format date fields
      const formattedMember = formatDateFields(member);
      
      let result;
      
      if (formattedMember.id) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_family')
          .update(formattedMember)
          .eq('id', formattedMember.id)
          .select('*')
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('employee_family')
          .insert(formattedMember)
          .select('*')
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      return result;
    } catch (error) {
      console.error('Failed to save family member:', error);
      toast.error('Failed to save family member');
      return null;
    }
  }
  
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
      toast.error('Failed to delete family member');
      return false;
    }
  }
  
  // Emergency contacts
  async fetchEmergencyContacts(employeeId: string): Promise<EmployeeEmergencyContact[]> {
    try {
      const { data, error } = await supabase
        .from('employee_emergency_contacts')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at');
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch emergency contacts:', error);
      return [];
    }
  }
  
  async saveEmergencyContact(contact: EmployeeEmergencyContact): Promise<EmployeeEmergencyContact | null> {
    try {
      let result;
      
      if (contact.id) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_emergency_contacts')
          .update(contact)
          .eq('id', contact.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('employee_emergency_contacts')
          .insert(contact)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      return result;
    } catch (error) {
      console.error('Failed to save emergency contact:', error);
      toast.error('Failed to save emergency contact');
      return null;
    }
  }
  
  async deleteEmergencyContact(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_emergency_contacts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Failed to delete emergency contact:', error);
      toast.error('Failed to delete emergency contact');
      return false;
    }
  }
  
  // Education
  async fetchEducation(employeeId: string): Promise<EmployeeEducation[]> {
    try {
      const { data, error } = await supabase
        .from('employee_education')
        .select('*')
        .eq('employee_id', employeeId)
        .order('start_date');
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch education:', error);
      return [];
    }
  }
  
  async saveEducation(education: EmployeeEducation): Promise<EmployeeEducation | null> {
    try {
      let result;
      
      if (education.id) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_education')
          .update(education)
          .eq('id', education.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('employee_education')
          .insert(education)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      return result;
    } catch (error) {
      console.error('Failed to save education:', error);
      toast.error('Failed to save education');
      return null;
    }
  }
  
  async deleteEducation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_education')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Failed to delete education:', error);
      toast.error('Failed to delete education');
      return false;
    }
  }
  
  // Work Experience
  async fetchWorkExperience(employeeId: string): Promise<EmployeeWorkExperience[]> {
    try {
      const { data, error } = await supabase
        .from('employee_work_experience')
        .select('*')
        .eq('employee_id', employeeId)
        .order('start_date', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch work experience:', error);
      return [];
    }
  }
  
  async saveWorkExperience(experience: EmployeeWorkExperience): Promise<EmployeeWorkExperience | null> {
    try {
      let result;
      
      if (experience.id) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_work_experience')
          .update(experience)
          .eq('id', experience.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('employee_work_experience')
          .insert(experience)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      return result;
    } catch (error) {
      console.error('Failed to save work experience:', error);
      toast.error('Failed to save work experience');
      return null;
    }
  }
  
  async deleteWorkExperience(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_work_experience')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Failed to delete work experience:', error);
      toast.error('Failed to delete work experience');
      return false;
    }
  }
}

export const employeeService = new EmployeeService();

// Update employee personal details
export async function updateEmployeePersonalDetails(employeeId: string, data: Partial<EmployeePersonalDetails>): Promise<EmployeePersonalDetails | null> {
  try {
    // Check if the personal details record exists
    const { data: existing } = await supabase
      .from('employee_personal_details')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (existing) {
      // Update existing record
      const { data: updated, error } = await supabase
        .from('employee_personal_details')
        .update({
          mobile_phone: data.mobile_phone,
          birth_place: data.birth_place,
          birth_date: data.birth_date ? String(data.birth_date) : null,
          gender: data.gender,
          marital_status: data.marital_status,
          blood_type: data.blood_type,
          religion: data.religion
        })
        .eq('employee_id', employeeId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } else {
      // Create new record
      const { data: created, error } = await supabase
        .from('employee_personal_details')
        .insert({
          employee_id: employeeId,
          mobile_phone: data.mobile_phone,
          birth_place: data.birth_place,
          birth_date: data.birth_date ? String(data.birth_date) : null,
          gender: data.gender,
          marital_status: data.marital_status,
          blood_type: data.blood_type,
          religion: data.religion
        })
        .select()
        .single();

      if (error) throw error;
      return created;
    }
  } catch (error) {
    console.error('Error updating employee personal details:', error);
    throw error;
  }
}

// Update employee employment details
export async function updateEmployeeEmployment(employeeId: string, data: Partial<EmployeeEmployment>): Promise<EmployeeEmployment | null> {
  try {
    // Check if the employment record exists
    const { data: existing } = await supabase
      .from('employee_employment')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (existing) {
      // Update existing record
      const { data: updated, error } = await supabase
        .from('employee_employment')
        .update({
          barcode: data.barcode,
          organization: data.organization,
          job_position: data.job_position,
          job_level: data.job_level,
          employment_status: data.employment_status,
          branch: data.branch,
          join_date: data.join_date ? String(data.join_date) : null,
          sign_date: data.sign_date ? String(data.sign_date) : null
        })
        .eq('employee_id', employeeId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } else {
      // Create new record
      const { data: created, error } = await supabase
        .from('employee_employment')
        .insert({
          employee_id: employeeId,
          barcode: data.barcode,
          organization: data.organization,
          job_position: data.job_position,
          job_level: data.job_level,
          employment_status: data.employment_status,
          branch: data.branch,
          join_date: data.join_date ? String(data.join_date) : null,
          sign_date: data.sign_date ? String(data.sign_date) : null
        })
        .select()
        .single();

      if (error) throw error;
      return created;
    }
  } catch (error) {
    console.error('Error updating employee employment details:', error);
    throw error;
  }
}

// Update employee identity address
export async function updateEmployeeIdentityAddress(employeeId: string, data: Partial<EmployeeIdentityAddress>): Promise<EmployeeIdentityAddress | null> {
  try {
    // Check if the identity address record exists
    const { data: existing } = await supabase
      .from('employee_identity_addresses')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (existing) {
      // Update existing record
      const { data: updated, error } = await supabase
        .from('employee_identity_addresses')
        .update({
          nik: data.nik,
          passport_number: data.passport_number,
          passport_expiry: data.passport_expiry ? String(data.passport_expiry) : null,
          postal_code: data.postal_code,
          citizen_address: data.citizen_address,
          residential_address: data.residential_address
        })
        .eq('employee_id', employeeId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } else {
      // Create new record
      const { data: created, error } = await supabase
        .from('employee_identity_addresses')
        .insert({
          employee_id: employeeId,
          nik: data.nik,
          passport_number: data.passport_number,
          passport_expiry: data.passport_expiry ? String(data.passport_expiry) : null,
          postal_code: data.postal_code,
          citizen_address: data.citizen_address,
          residential_address: data.residential_address
        })
        .select()
        .single();

      if (error) throw error;
      return created;
    }
  } catch (error) {
    console.error('Error updating employee identity address:', error);
    throw error;
  }
}
