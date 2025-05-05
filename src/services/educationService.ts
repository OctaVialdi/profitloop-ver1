
import { supabase } from "@/integrations/supabase/client";

export interface FormalEducation {
  id?: string;
  employee_id: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_date?: string | null;
  end_date?: string | null;
  grade?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface InformalEducation {
  id?: string;
  employee_id: string;
  course_name: string;
  provider: string;
  certificate_number?: string | null;
  certification_field: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface WorkExperience {
  id?: string;
  employee_id: string;
  company_name: string;
  position: string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  job_description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const educationService = {
  // Formal Education Methods
  async getFormalEducation(employeeId: string): Promise<FormalEducation[]> {
    try {
      const { data, error } = await supabase
        .from('employee_formal_education')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching formal education:', error);
      throw error;
    }
  },
  
  async addFormalEducation(educationData: FormalEducation): Promise<FormalEducation> {
    try {
      const { data, error } = await supabase
        .from('employee_formal_education')
        .insert(educationData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error adding formal education:', error);
      throw error;
    }
  },
  
  async updateFormalEducation(id: string, educationData: Partial<FormalEducation>): Promise<FormalEducation> {
    try {
      const { data, error } = await supabase
        .from('employee_formal_education')
        .update(educationData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error updating formal education:', error);
      throw error;
    }
  },
  
  async deleteFormalEducation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_formal_education')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting formal education:', error);
      throw error;
    }
  },

  // Informal Education Methods
  async getInformalEducation(employeeId: string): Promise<InformalEducation[]> {
    try {
      const { data, error } = await supabase
        .from('employee_informal_education')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching informal education:', error);
      throw error;
    }
  },
  
  async addInformalEducation(educationData: InformalEducation): Promise<InformalEducation> {
    try {
      const { data, error } = await supabase
        .from('employee_informal_education')
        .insert(educationData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error adding informal education:', error);
      throw error;
    }
  },
  
  async updateInformalEducation(id: string, educationData: Partial<InformalEducation>): Promise<InformalEducation> {
    try {
      const { data, error } = await supabase
        .from('employee_informal_education')
        .update(educationData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error updating informal education:', error);
      throw error;
    }
  },
  
  async deleteInformalEducation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_informal_education')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting informal education:', error);
      throw error;
    }
  },

  // Work Experience Methods
  async getWorkExperience(employeeId: string): Promise<WorkExperience[]> {
    try {
      const { data, error } = await supabase
        .from('employee_working_experience')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching work experience:', error);
      throw error;
    }
  },
  
  async addWorkExperience(experienceData: WorkExperience): Promise<WorkExperience> {
    try {
      const { data, error } = await supabase
        .from('employee_working_experience')
        .insert(experienceData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error adding work experience:', error);
      throw error;
    }
  },
  
  async updateWorkExperience(id: string, experienceData: Partial<WorkExperience>): Promise<WorkExperience> {
    try {
      const { data, error } = await supabase
        .from('employee_working_experience')
        .update(experienceData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error updating work experience:', error);
      throw error;
    }
  },
  
  async deleteWorkExperience(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_working_experience')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting work experience:', error);
      throw error;
    }
  }
};
