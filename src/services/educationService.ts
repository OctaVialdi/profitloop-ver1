
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

export const educationService = {
  // Get formal education for an employee
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
  
  // Add formal education
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
  
  // Update formal education
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
  
  // Delete formal education
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
  }
};
