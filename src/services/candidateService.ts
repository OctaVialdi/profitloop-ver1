
import { supabase } from "@/integrations/supabase/client";
import { PostgrestResponse } from "@supabase/supabase-js";

export interface CandidateApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  birth_date: string | null;
  birth_place: string | null;
  gender: string | null;
  religion: string | null;
  marital_status: string | null;
  blood_type: string | null;
  nik: string | null;
  passport_number: string | null;
  passport_expiry: string | null;
  postal_code: string | null;
  citizen_address: string | null;
  status: string;
  job_position_id: string | null;
  organization_id: string;
  recruitment_link_id: string;
  created_at: string;
  job_title?: string;
  score?: number;
}

export interface CandidateWithDetails extends CandidateApplication {
  familyMembers?: CandidateFamilyMember[];
  formalEducation?: CandidateFormalEducation[];
  informalEducation?: CandidateInformalEducation[];
  workExperience?: CandidateWorkExperience[];
  job_title?: string;
  organization_name?: string;
  evaluations?: CandidateEvaluation[];
}

export interface CandidateFamilyMember {
  id: string;
  candidate_application_id: string;
  name: string;
  relationship: string | null;
  gender: string | null;
  age: number | null;
  occupation: string | null;
  phone: string | null;
  address: string | null;
  is_emergency_contact: boolean;
}

export interface CandidateFormalEducation {
  id: string;
  candidate_application_id: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_date: string | null;
  end_date: string | null;
  grade: string | null;
  description: string | null;
}

export interface CandidateInformalEducation {
  id: string;
  candidate_application_id: string;
  course_name: string;
  provider: string;
  certification_field: string;
  certificate_number: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

export interface CandidateWorkExperience {
  id: string;
  candidate_application_id: string;
  company_name: string;
  position: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  job_description: string | null;
}

export interface CandidateEvaluation {
  id: string;
  candidate_id: string;
  evaluator_id: string | null;
  technical_skills: number | null;
  communication: number | null;
  cultural_fit: number | null;
  experience_relevance: number | null;
  overall_impression: number | null;
  average_score: number;
  comments: string | null;
  created_at: string;
  updated_at: string;
  evaluator_name?: string;
  criteria_scores?: EvaluationCriteriaScore[] | any; // Allow any for JSON compatibility
}

export interface EvaluationCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  criteria: EvaluationCriterion[];
}

export interface EvaluationCriterion {
  id: string;
  category_id: string;
  question: string;
  display_order: number;
}

export interface EvaluationCriteriaScore {
  criterion_id: string;
  category_id: string;
  score: number;
  question: string;
  category: string;
}

export const candidateService = {
  async fetchCandidates(): Promise<CandidateApplication[]> {
    try {
      const { data: candidates, error } = await supabase
        .from("candidate_applications")
        .select(`
          *,
          job_positions(title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the expected format
      return candidates.map(candidate => ({
        ...candidate,
        job_title: candidate.job_positions?.title || "General Application"
      }));
    } catch (error) {
      console.error("Error fetching candidates:", error);
      return [];
    }
  },

  async fetchCandidateById(id: string): Promise<CandidateWithDetails | null> {
    try {
      // Fetch the main candidate application data
      const { data: candidate, error } = await supabase
        .from("candidate_applications")
        .select(`
          *,
          job_positions(title),
          organizations(name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!candidate) return null;

      // Fetch family members
      const { data: familyMembers } = await supabase
        .from("candidate_family_members")
        .select("*")
        .eq("candidate_application_id", id);

      // Fetch formal education
      const { data: formalEducation } = await supabase
        .from("candidate_formal_education")
        .select("*")
        .eq("candidate_application_id", id);

      // Fetch informal education
      const { data: informalEducation } = await supabase
        .from("candidate_informal_education")
        .select("*")
        .eq("candidate_application_id", id);

      // Fetch work experience
      const { data: workExperience } = await supabase
        .from("candidate_work_experience")
        .select("*")
        .eq("candidate_application_id", id);

      // Fetch evaluations
      const { data: evaluations } = await supabase
        .from("candidate_evaluations")
        .select("*")
        .eq("candidate_id", id)
        .order("created_at", { ascending: false });

      // Ensure evaluations have the right format (if there are any)
      const processedEvaluations = evaluations ? evaluations.map((evaluation: any) => {
        // Process the evaluation to match our interface
        const parsedEval = {
          ...evaluation,
          // If criteria_scores exists but comes as a string, parse it
          criteria_scores: evaluation.criteria_scores ? 
            (typeof evaluation.criteria_scores === 'string' ? 
              JSON.parse(evaluation.criteria_scores) : 
              evaluation.criteria_scores) : 
            undefined
        };
        return parsedEval as CandidateEvaluation;
      }) : [];

      // Combine all data into a single object
      return {
        ...candidate,
        job_title: candidate.job_positions?.title || "General Application",
        organization_name: candidate.organizations?.name || "",
        familyMembers: familyMembers || [],
        formalEducation: formalEducation || [],
        informalEducation: informalEducation || [],
        workExperience: workExperience || [],
        evaluations: processedEvaluations
      };
    } catch (error) {
      console.error("Error fetching candidate by id:", error);
      return null;
    }
  },
  
  async updateCandidateStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("candidate_applications")
        .update({ status })
        .eq("id", id);

      return !error;
    } catch (error) {
      console.error("Error updating candidate status:", error);
      return false;
    }
  },

  async fetchEvaluationCriteria(): Promise<EvaluationCategory[]> {
    try {
      // First, fetch all categories
      const { data: categories, error: categoriesError } = await supabase
        .from("evaluation_categories")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (categoriesError) throw categoriesError;
      
      // Then, fetch all criteria
      const { data: criteria, error: criteriaError } = await supabase
        .from("evaluation_criteria")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (criteriaError) throw criteriaError;
      
      // Group criteria by category
      return categories.map(category => {
        const categoryCriteria = criteria
          .filter(criterion => criterion.category_id === category.id)
          .sort((a, b) => a.display_order - b.display_order);
        
        return {
          ...category,
          criteria: categoryCriteria
        };
      });
    } catch (error) {
      console.error("Error fetching evaluation criteria:", error);
      return [];
    }
  },

  async submitEvaluation(evaluation: Omit<CandidateEvaluation, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean, data?: CandidateEvaluation, error?: any }> {
    try {
      // Convert criteria_scores to format expected by Supabase
      const dataToInsert = {
        ...evaluation,
        evaluator_id: (await supabase.auth.getUser()).data.user?.id,
        criteria_scores: evaluation.criteria_scores ? JSON.stringify(evaluation.criteria_scores) : undefined
      };

      // Insert the evaluation - the trigger will calculate the average score
      const { data, error }: PostgrestResponse<any> = await supabase
        .from("candidate_evaluations")
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        console.error("Error submitting evaluation:", error);
        return { success: false, error };
      }

      // Process the returned data to match our interface
      const processedData: CandidateEvaluation = {
        ...data,
        criteria_scores: data.criteria_scores ? 
          (typeof data.criteria_scores === 'string' ? 
            JSON.parse(data.criteria_scores) : 
            data.criteria_scores) : 
          undefined
      };

      return {
        success: true,
        data: processedData
      };
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      return { success: false, error };
    }
  },

  async updateEvaluation(id: string, updates: Partial<CandidateEvaluation>): Promise<{ success: boolean, data?: CandidateEvaluation, error?: any }> {
    try {
      // Convert criteria_scores to format expected by Supabase
      const dataToUpdate = {
        ...updates,
        criteria_scores: updates.criteria_scores ? JSON.stringify(updates.criteria_scores) : undefined
      };

      // Update the evaluation - the trigger will recalculate the average score
      const { data, error }: PostgrestResponse<any> = await supabase
        .from("candidate_evaluations")
        .update(dataToUpdate)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating evaluation:", error);
        return { success: false, error };
      }

      // Process the returned data to match our interface
      const processedData: CandidateEvaluation = {
        ...data,
        criteria_scores: data.criteria_scores ? 
          (typeof data.criteria_scores === 'string' ? 
            JSON.parse(data.criteria_scores) : 
            data.criteria_scores) : 
          undefined
      };

      return {
        success: true,
        data: processedData
      };
    } catch (error) {
      console.error("Error updating evaluation:", error);
      return { success: false, error };
    }
  },

  async deleteEvaluation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("candidate_evaluations")
        .delete()
        .eq("id", id);

      return !error;
    } catch (error) {
      console.error("Error deleting evaluation:", error);
      return false;
    }
  }
};
