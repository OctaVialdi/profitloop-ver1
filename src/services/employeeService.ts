
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
          const [personalDetails, identityAddress, employment] = await Promise.all([
            this.fetchPersonalDetails(employee.id),
            this.fetchIdentityAddress(employee.id),
            this.fetchEmployment(employee.id),
          ]);
          
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
      
      const [personalDetails, identityAddress, employment] = await Promise.all([
        this.fetchPersonalDetails(id),
        this.fetchIdentityAddress(id),
        this.fetchEmployment(id),
      ]);
      
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
      
      const { data: existingDetails } = await supabase
        .from('employee_personal_details')
        .select('id')
        .eq('employee_id', formattedDetails.employee_id);
      
      let result;
      
      if (existingDetails && existingDetails.length > 0) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_personal_details')
          .update(formattedDetails)
          .eq('id', existingDetails[0].id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('employee_personal_details')
          .insert(formattedDetails)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
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
        console.error('Error fetching identity & address:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch identity & address:', error);
      return [];
    }
  }
  
  async saveIdentityAddress(details: EmployeeIdentityAddress): Promise<EmployeeIdentityAddress | null> {
    try {
      // Format date fields
      const formattedDetails = formatDateFields(details);
      
      const { data: existingDetails } = await supabase
        .from('employee_identity_addresses')
        .select('id')
        .eq('employee_id', formattedDetails.employee_id);
      
      let result;
      
      if (existingDetails && existingDetails.length > 0) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_identity_addresses')
          .update(formattedDetails)
          .eq('id', existingDetails[0].id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('employee_identity_addresses')
          .insert(formattedDetails)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
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
        console.error('Error fetching employment:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch employment:', error);
      return [];
    }
  }
  
  async saveEmployment(details: EmployeeEmployment): Promise<EmployeeEmployment | null> {
    try {
      // Format date fields
      const formattedDetails = formatDateFields(details);
      
      const { data: existingDetails } = await supabase
        .from('employee_employment')
        .select('id')
        .eq('employee_id', formattedDetails.employee_id);
      
      let result;
      
      if (existingDetails && existingDetails.length > 0) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_employment')
          .update(formattedDetails)
          .eq('id', existingDetails[0].id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('employee_employment')
          .insert(formattedDetails)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
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
      
      // Create base employee record with required name
      const employeeToCreate = {
        ...employeeData,
        name: employeeData.name || 'New Employee', // Ensure name is always provided
        organization_id: profileResult.organization_id
      };
      
      // Create base employee record
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .insert(employeeToCreate)
        .select()
        .single();
        
      if (employeeError) throw employeeError;
      
      // Create related records
      const promises = [];
      
      if (personalDetails) {
        promises.push(
          this.savePersonalDetails({
            ...personalDetails,
            employee_id: employee.id
          })
        );
      }
      
      if (identityAddress) {
        promises.push(
          this.saveIdentityAddress({
            ...identityAddress,
            employee_id: employee.id
          })
        );
      }
      
      if (employment) {
        promises.push(
          this.saveEmployment({
            ...employment,
            employee_id: employee.id
          })
        );
      }
      
      await Promise.all(promises);
      
      // Return the newly created employee with details
      return this.fetchEmployeeById(employee.id);
      
    } catch (error) {
      console.error('Failed to create employee:', error);
      toast.error('Failed to create employee');
      return null;
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
      const promises = [];
      
      if (personalDetails) {
        promises.push(
          this.savePersonalDetails({
            ...personalDetails,
            employee_id: id
          })
        );
      }
      
      if (identityAddress) {
        promises.push(
          this.saveIdentityAddress({
            ...identityAddress,
            employee_id: id
          })
        );
      }
      
      if (employment) {
        promises.push(
          this.saveEmployment({
            ...employment,
            employee_id: id
          })
        );
      }
      
      await Promise.all(promises);
      
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
      let result;
      
      if (member.id) {
        // Update existing record
        const { data, error } = await supabase
          .from('employee_family')
          .update(member)
          .eq('id', member.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('employee_family')
          .insert(member)
          .select()
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
