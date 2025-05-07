
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

export interface InterviewNotes {
  id?: string;
  candidate_id: string;
  content: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
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
        let criteriaScores: any = undefined;
        
        if (evaluation.criteria_scores) {
          if (typeof evaluation.criteria_scores === 'string') {
            try {
              criteriaScores = JSON.parse(evaluation.criteria_scores);
            } catch (e) {
              console.error("Error parsing criteria_scores:", e);
              criteriaScores = undefined;
            }
          } else {
            criteriaScores = evaluation.criteria_scores;
          }
        }
        
        // Create a properly typed evaluation object
        const parsedEval: CandidateEvaluation = {
          id: evaluation.id,
          candidate_id: evaluation.candidate_id,
          evaluator_id: evaluation.evaluator_id,
          technical_skills: evaluation.technical_skills,
          communication: evaluation.communication,
          cultural_fit: evaluation.cultural_fit,
          experience_relevance: evaluation.experience_relevance,
          overall_impression: evaluation.overall_impression,
          average_score: evaluation.average_score,
          comments: evaluation.comments,
          created_at: evaluation.created_at,
          updated_at: evaluation.updated_at,
          evaluator_name: evaluation.evaluator_name,
          criteria_scores: criteriaScores
        };
        
        return parsedEval;
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
    console.log(`Updating candidate status: ${id} to ${status}`);
    try {
      const { error } = await supabase
        .from("candidate_applications")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error("Error updating candidate status:", error);
        return false;
      }
      
      return true;
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
      console.log("Submitting evaluation:", evaluation);
      
      // Convert criteria_scores to format expected by Supabase
      // Make sure criteria_scores is properly formatted as a JSON string
      const criteriaScores = evaluation.criteria_scores 
        ? JSON.stringify(evaluation.criteria_scores) 
        : null;
      
      // Prepare data for insertion
      const dataToInsert = {
        ...evaluation,
        evaluator_id: (await supabase.auth.getUser()).data.user?.id,
        criteria_scores: criteriaScores
      };

      console.log("Data to insert:", dataToInsert);
      
      // Insert the evaluation - the trigger will calculate the average score
      const { data, error } = await supabase
        .from("candidate_evaluations")
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        console.error("Error submitting evaluation:", error);
        return { success: false, error };
      }

      // Process the returned data to match our interface
      let parsedCriteriaScores: EvaluationCriteriaScore[] | undefined = undefined;
      
      if (data.criteria_scores) {
        if (typeof data.criteria_scores === 'string') {
          try {
            parsedCriteriaScores = JSON.parse(data.criteria_scores);
          } catch (e) {
            console.error("Error parsing returned criteria_scores:", e);
            parsedCriteriaScores = undefined;
          }
        } else if (Array.isArray(data.criteria_scores)) {
          // Handle case where it's already an array
          parsedCriteriaScores = data.criteria_scores as EvaluationCriteriaScore[];
        } else {
          console.error("Unexpected criteria_scores format:", typeof data.criteria_scores);
          parsedCriteriaScores = undefined;
        }
      }
      
      // Create a properly typed evaluation object for return
      const processedData: CandidateEvaluation = {
        id: data.id,
        candidate_id: data.candidate_id,
        evaluator_id: data.evaluator_id,
        technical_skills: data.technical_skills,
        communication: data.communication,
        cultural_fit: data.cultural_fit,
        experience_relevance: data.experience_relevance,
        overall_impression: data.overall_impression,
        average_score: data.average_score,
        comments: data.comments,
        created_at: data.created_at,
        updated_at: data.updated_at,
        criteria_scores: parsedCriteriaScores
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
      const { data, error } = await supabase
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
      let parsedCriteriaScores: EvaluationCriteriaScore[] | undefined = undefined;
      
      if (data.criteria_scores) {
        if (typeof data.criteria_scores === 'string') {
          try {
            parsedCriteriaScores = JSON.parse(data.criteria_scores);
          } catch (e) {
            console.error("Error parsing returned criteria_scores:", e);
            parsedCriteriaScores = undefined;
          }
        } else if (Array.isArray(data.criteria_scores)) {
          // Handle case where it's already an array
          parsedCriteriaScores = data.criteria_scores as EvaluationCriteriaScore[];
        } else {
          console.error("Unexpected criteria_scores format:", typeof data.criteria_scores);
          parsedCriteriaScores = undefined;
        }
      }
      
      // Create a properly typed evaluation object for return
      const processedData: CandidateEvaluation = {
        id: data.id,
        candidate_id: data.candidate_id,
        evaluator_id: data.evaluator_id,
        technical_skills: data.technical_skills,
        communication: data.communication,
        cultural_fit: data.cultural_fit,
        experience_relevance: data.experience_relevance,
        overall_impression: data.overall_impression,
        average_score: data.average_score,
        comments: data.comments,
        created_at: data.created_at,
        updated_at: data.updated_at,
        criteria_scores: parsedCriteriaScores
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
      // First, get the candidate_id from the evaluation before deleting it
      const { data: evaluation, error: fetchError } = await supabase
        .from("candidate_evaluations")
        .select("candidate_id")
        .eq("id", id)
        .single();
      
      if (fetchError || !evaluation) {
        console.error("Error fetching evaluation before deletion:", fetchError);
        return false;
      }
      
      const candidateId = evaluation.candidate_id;
      
      // Delete the evaluation
      const { error: deleteError } = await supabase
        .from("candidate_evaluations")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Error deleting evaluation:", deleteError);
        return false;
      }
      
      // Check if there are any remaining evaluations for this candidate
      const { data: remainingEvaluations, error: countError } = await supabase
        .from("candidate_evaluations")
        .select("average_score")
        .eq("candidate_id", candidateId);
      
      if (countError) {
        console.error("Error counting remaining evaluations:", countError);
        return false;
      }
      
      // Update the candidate's score based on remaining evaluations
      if (remainingEvaluations && remainingEvaluations.length > 0) {
        // Calculate new average score from remaining evaluations
        const totalScore = remainingEvaluations.reduce((sum, evaluation) => sum + evaluation.average_score, 0);
        const newAverageScore = totalScore / remainingEvaluations.length;
        
        const { error: updateError } = await supabase
          .from("candidate_applications")
          .update({ score: newAverageScore })
          .eq("id", candidateId);
          
        if (updateError) {
          console.error("Error updating candidate score:", updateError);
          return false;
        }
      } else {
        // If no evaluations remain, set the score to null
        const { error: updateError } = await supabase
          .from("candidate_applications")
          .update({ score: null })
          .eq("id", candidateId);
          
        if (updateError) {
          console.error("Error resetting candidate score:", updateError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error in deleteEvaluation process:", error);
      return false;
    }
  },

  async fetchAllCategories(): Promise<EvaluationCategory[]> {
    try {
      const { data: categories, error } = await supabase
        .from("evaluation_categories")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) {
        console.error("Error fetching evaluation categories:", error);
        return [];
      }
      
      // Initialize empty criteria array for each category
      const categoriesWithEmptyCriteria = categories.map(category => ({
        ...category,
        criteria: []
      }));
      
      return categoriesWithEmptyCriteria;
    } catch (error) {
      console.error("Error fetching evaluation categories:", error);
      return [];
    }
  },

  async createCategory(name: string, description?: string): Promise<{ success: boolean, data?: EvaluationCategory, error?: any }> {
    try {
      // Get the highest display_order to add the new category at the end
      const { data: lastCategory } = await supabase
        .from("evaluation_categories")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1);
      
      const nextOrder = lastCategory && lastCategory.length > 0 
        ? (lastCategory[0].display_order + 1) 
        : 1;
      
      const { data, error } = await supabase
        .from("evaluation_categories")
        .insert({
          name,
          description,
          display_order: nextOrder
        })
        .select()
        .single();
      
      if (error) {
        return { success: false, error };
      }
      
      // Add empty criteria array to conform to the EvaluationCategory type
      const categoryWithCriteria: EvaluationCategory = {
        ...data,
        criteria: []
      };
      
      return {
        success: true,
        data: categoryWithCriteria
      };
    } catch (error) {
      console.error("Error creating evaluation category:", error);
      return { success: false, error };
    }
  },

  async updateCategory(id: string, updates: Partial<Omit<EvaluationCategory, 'id' | 'criteria'>>): Promise<{ success: boolean, data?: EvaluationCategory, error?: any }> {
    try {
      const { data, error } = await supabase
        .from("evaluation_categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        return { success: false, error };
      }
      
      // Add empty criteria array to conform to the EvaluationCategory type
      const categoryWithCriteria: EvaluationCategory = {
        ...data,
        criteria: []
      };
      
      return {
        success: true,
        data: categoryWithCriteria
      };
    } catch (error) {
      console.error("Error updating evaluation category:", error);
      return { success: false, error };
    }
  },

  async deleteCategory(id: string): Promise<{ success: boolean, error?: any }> {
    try {
      // Check if there are criteria using this category first
      const { data: criteria, error: criteriaError } = await supabase
        .from("evaluation_criteria")
        .select("id")
        .eq("category_id", id);
      
      if (criteriaError) {
        return { success: false, error: criteriaError };
      }
      
      if (criteria && criteria.length > 0) {
        return { 
          success: false, 
          error: { message: "This category cannot be deleted because it has criteria associated with it. Delete the criteria first." }
        };
      }
      
      // If no criteria are using it, proceed with deletion
      const { error } = await supabase
        .from("evaluation_categories")
        .delete()
        .eq("id", id);
      
      if (error) {
        return { success: false, error };
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error("Error deleting evaluation category:", error);
      return { success: false, error };
    }
  },

  async updateCategoryOrder(categories: { id: string, display_order: number }[]): Promise<{ success: boolean, error?: any }> {
    try {
      // Instead of using RPC, update each category separately
      for (const category of categories) {
        const { error: updateError } = await supabase
          .from("evaluation_categories")
          .update({ display_order: category.display_order })
          .eq("id", category.id);
        
        if (updateError) {
          return { success: false, error: updateError };
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error updating category order:", error);
      return { success: false, error };
    }
  },

  async fetchCriteriaByCategory(categoryId: string): Promise<EvaluationCriterion[]> {
    try {
      const { data, error } = await supabase
        .from("evaluation_criteria")
        .select("*")
        .eq("category_id", categoryId)
        .order("display_order", { ascending: true });
      
      if (error) {
        console.error("Error fetching evaluation criteria:", error);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching evaluation criteria:", error);
      return [];
    }
  },

  async createCriterion(categoryId: string, question: string): Promise<{ success: boolean, data?: EvaluationCriterion, error?: any }> {
    try {
      // Get the highest display_order in this category to add the new criterion at the end
      const { data: lastCriterion } = await supabase
        .from("evaluation_criteria")
        .select("display_order")
        .eq("category_id", categoryId)
        .order("display_order", { ascending: false })
        .limit(1);
      
      const nextOrder = lastCriterion && lastCriterion.length > 0 
        ? (lastCriterion[0].display_order + 1) 
        : 1;
      
      const { data, error } = await supabase
        .from("evaluation_criteria")
        .insert({
          category_id: categoryId,
          question,
          display_order: nextOrder
        })
        .select()
        .single();
      
      if (error) {
        return { success: false, error };
      }
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Error creating evaluation criterion:", error);
      return { success: false, error };
    }
  },

  async updateCriterion(id: string, updates: Partial<Omit<EvaluationCriterion, 'id'>>): Promise<{ success: boolean, data?: EvaluationCriterion, error?: any }> {
    try {
      const { data, error } = await supabase
        .from("evaluation_criteria")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        return { success: false, error };
      }
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Error updating evaluation criterion:", error);
      return { success: false, error };
    }
  },

  async deleteCriterion(id: string): Promise<{ success: boolean, error?: any }> {
    try {
      const { error } = await supabase
        .from("evaluation_criteria")
        .delete()
        .eq("id", id);
      
      if (error) {
        return { success: false, error };
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error("Error deleting evaluation criterion:", error);
      return { success: false, error };
    }
  },

  async updateCriteriaOrder(criteria: { id: string, display_order: number }[]): Promise<{ success: boolean, error?: any }> {
    try {
      // Use a transaction to update all criteria at once
      const updates = criteria.map(({ id, display_order }) => ({
        id,
        display_order
      }));
      
      // Similar approach as updateCategoryOrder - can be improved with a database function
      for (const criterion of criteria) {
        const { error: updateError } = await supabase
          .from("evaluation_criteria")
          .update({ display_order: criterion.display_order })
          .eq("id", criterion.id);
        
        if (updateError) {
          return { success: false, error: updateError };
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error updating criteria order:", error);
      return { success: false, error };
    }
  },

  async fetchInterviewNotes(candidateId: string): Promise<InterviewNotes | null> {
    try {
      console.log(`Fetching interview notes for candidate: ${candidateId}`);
      const { data, error } = await supabase
        .from("candidate_interview_notes")
        .select("*")
        .eq("candidate_id", candidateId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error("Error fetching interview notes:", error);
        return null;
      }

      console.log("Fetched interview notes:", data);
      return data || null;
    } catch (error) {
      console.error("Error fetching interview notes:", error);
      return null;
    }
  },

  async saveInterviewNotes(notes: InterviewNotes): Promise<{ success: boolean, error?: any }> {
    try {
      console.log(`Saving interview notes for candidate: ${notes.candidate_id}`);
      
      // Check if notes already exist for this candidate
      const { data: existingNotes, error: checkError } = await supabase
        .from("candidate_interview_notes")
        .select("id")
        .eq("candidate_id", notes.candidate_id);

      if (checkError) {
        console.error("Error checking existing notes:", checkError);
        return { success: false, error: checkError };
      }
      
      let result;
      
      if (existingNotes && existingNotes.length > 0) {
        // Update existing notes
        console.log(`Updating existing notes with ID: ${existingNotes[0].id}`);
        result = await supabase
          .from("candidate_interview_notes")
          .update({
            content: notes.content,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingNotes[0].id);
      } else {
        // Insert new notes
        console.log("Creating new interview notes");
        result = await supabase
          .from("candidate_interview_notes")
          .insert({
            candidate_id: notes.candidate_id,
            content: notes.content,
            created_by: notes.created_by
          });
      }

      if (result.error) {
        console.error("Error saving interview notes:", result.error);
        return { success: false, error: result.error };
      }

      console.log("Interview notes saved successfully");
      return { success: true };
    } catch (error) {
      console.error("Error saving interview notes:", error);
      return { success: false, error };
    }
  }
};
