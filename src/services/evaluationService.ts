
import { supabase } from "@/integrations/supabase/client";
import { ensureEvaluationHasCriteriaScores } from "@/utils/evaluationUtils";
import { CandidateEvaluation, EvaluationCategory, EvaluationCriterion, EvaluationCriteriaScore } from "./candidateService";
import { EvaluationCategoryData } from "@/components/hr/recruitment/candidate-detail/EvaluationTypes";

export interface StatusOption {
  id?: string;
  value: string;
  label: string;
  is_system?: boolean;
}

/**
 * Service for handling candidate evaluations
 */
export const evaluationService = {
  /**
   * Fetches evaluation criteria categories and their criteria
   */
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

  /**
   * Fetches evaluation category data using a direct query instead of RPC
   */
  async fetchEvaluationCriteriaNames(): Promise<EvaluationCategoryData[]> {
    try {
      // Query evaluation_categories and join with evaluation_criteria
      const { data, error } = await supabase
        .from("evaluation_categories")
        .select(`
          id:id,
          category_name:name,
          criteria:evaluation_criteria(id, question)
        `)
        .order('display_order');
      
      if (error) {
        console.error("Error fetching criteria names:", error);
        return [];
      }
      
      // Transform data to match EvaluationCategoryData structure
      if (data && Array.isArray(data)) {
        return data.map(item => ({
          category_id: item.id,
          category_name: item.category_name,
          criteria: item.criteria
        })) as EvaluationCategoryData[];
      }
      
      return [];
    } catch (error) {
      console.error("Error in fetchEvaluationCriteriaNames:", error);
      return [];
    }
  },

  /**
   * Submits a new evaluation for a candidate
   */
  async submitEvaluation(
    evaluation: Omit<CandidateEvaluation, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ success: boolean, data?: CandidateEvaluation, error?: any }> {
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

      // Process the returned data
      const processedData = this.processEvaluationData(data);

      return {
        success: true,
        data: processedData
      };
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      return { success: false, error };
    }
  },

  /**
   * Updates an existing evaluation
   */
  async updateEvaluation(
    id: string, 
    updates: Partial<CandidateEvaluation>
  ): Promise<{ success: boolean, data?: CandidateEvaluation, error?: any }> {
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

      // Process the returned data
      const processedData = this.processEvaluationData(data);

      return {
        success: true,
        data: processedData
      };
    } catch (error) {
      console.error("Error updating evaluation:", error);
      return { success: false, error };
    }
  },

  /**
   * Deletes an evaluation and updates the candidate's score
   */
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
        const totalScore = remainingEvaluations.reduce(
          (sum, evaluation) => sum + evaluation.average_score, 
          0
        );
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

  /**
   * Process evaluation data from the database to ensure it's in the correct format
   */
  processEvaluationData(evaluationData: any): CandidateEvaluation {
    // Parse criteria scores if they're a string
    let parsedCriteriaScores: EvaluationCriteriaScore[] | undefined = undefined;
      
    if (evaluationData.criteria_scores) {
      if (typeof evaluationData.criteria_scores === 'string') {
        try {
          // Parse the JSON string back to an object
          const parsedJson = JSON.parse(evaluationData.criteria_scores);
          
          // Validate and map to our expected type
          if (Array.isArray(parsedJson)) {
            // Map each item to ensure it matches our type
            parsedCriteriaScores = parsedJson.map(item => ({
              criterion_id: item.criterion_id,
              category_id: item.category_id,
              score: item.score,
              question: item.question,
              category: item.category
            }));
          }
        } catch (e) {
          console.error("Error parsing returned criteria_scores:", e);
          parsedCriteriaScores = undefined;
        }
      } else if (Array.isArray(evaluationData.criteria_scores)) {
        // Map the array data to our expected type
        parsedCriteriaScores = (evaluationData.criteria_scores as any[]).map(item => ({
          criterion_id: item.criterion_id,
          category_id: item.category_id,
          score: item.score,
          question: item.question,
          category: item.category
        }));
      } else {
        console.error("Unexpected criteria_scores format:", typeof evaluationData.criteria_scores);
        parsedCriteriaScores = undefined;
      }
    }
    
    // Create a properly typed evaluation object for return
    const processedData: CandidateEvaluation = {
      id: evaluationData.id,
      candidate_id: evaluationData.candidate_id,
      evaluator_id: evaluationData.evaluator_id,
      technical_skills: evaluationData.technical_skills,
      communication: evaluationData.communication,
      cultural_fit: evaluationData.cultural_fit,
      experience_relevance: evaluationData.experience_relevance,
      overall_impression: evaluationData.overall_impression,
      average_score: evaluationData.average_score,
      comments: evaluationData.comments,
      created_at: evaluationData.created_at,
      updated_at: evaluationData.updated_at,
      evaluator_name: evaluationData.evaluator_name,
      criteria_scores: parsedCriteriaScores
    };

    // Ensure the evaluation has criteria scores in the right format
    return ensureEvaluationHasCriteriaScores(processedData);
  },

  /**
   * Retrieves interview notes for a candidate
   */
  async fetchInterviewNotes(candidateId: string) {
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

  /**
   * Saves interview notes for a candidate
   */
  async saveInterviewNotes(notes: {
    candidate_id: string;
    content: string;
    created_by: string;
  }): Promise<{ success: boolean, error?: any }> {
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
  },
  
  /**
   * Fetches available candidate status options from the database
   */
  async fetchCandidateStatusOptions(): Promise<StatusOption[]> {
    try {
      console.log("Fetching candidate status options from the database");
      
      // Get the user's organization
      const { data: profileData } = await supabase.auth.getUser();
      if (!profileData.user) {
        throw new Error("User is not authenticated");
      }
      
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profileData.user.id)
        .single();
      
      if (!userProfile?.organization_id) {
        throw new Error("User does not belong to an organization");
      }
      
      // Fetch status options for the user's organization using custom function
      const { data, error } = await supabase.rpc('get_status_options', {
        org_id: userProfile.organization_id
      });
      
      if (error) {
        console.error("Error fetching status options:", error);
        // Return default options as fallback
        return [
          { value: 'new', label: 'New' },
          { value: 'screening', label: 'Screening' },
          { value: 'interview', label: 'Interview' },
          { value: 'assessment', label: 'Assessment' },
          { value: 'offered', label: 'Offered' },
          { value: 'hired', label: 'Hired' },
          { value: 'rejected', label: 'Rejected' }
        ];
      }
      
      console.log("Fetched status options:", data);
      return data as StatusOption[];
    } catch (error) {
      console.error("Error in fetchCandidateStatusOptions:", error);
      // Return default options as fallback
      return [
        { value: 'new', label: 'New' },
        { value: 'screening', label: 'Screening' },
        { value: 'interview', label: 'Interview' },
        { value: 'assessment', label: 'Assessment' },
        { value: 'offered', label: 'Offered' },
        { value: 'hired', label: 'Hired' },
        { value: 'rejected', label: 'Rejected' }
      ];
    }
  },
  
  /**
   * Create a new status option
   */
  async createStatusOption(status: { value: string; label: string }): Promise<{ success: boolean; error?: any; data?: StatusOption }> {
    try {
      // Get the user's organization
      const { data: profileData } = await supabase.auth.getUser();
      if (!profileData.user) {
        throw new Error("User is not authenticated");
      }
      
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profileData.user.id)
        .single();
      
      if (!userProfile?.organization_id) {
        throw new Error("User does not belong to an organization");
      }
      
      // Normalize the value (lowercase, no spaces)
      const normalizedValue = status.value.toLowerCase().replace(/\s+/g, '_');
      
      // Insert the new status option using our custom function
      const { data, error } = await supabase.rpc('create_status_option', {
        p_value: normalizedValue,
        p_label: status.label,
        p_org_id: userProfile.organization_id
      });
      
      if (error) {
        console.error("Error creating status option:", error);
        return { success: false, error };
      }
      
      // Handle the returned data appropriately - ensure we're taking the first item if array is returned
      let resultData: StatusOption;
      
      if (Array.isArray(data)) {
        if (data.length === 0) {
          return { success: false, error: "No data returned from operation" };
        }
        resultData = data[0];
      } else {
        resultData = data;
      }
      
      return { 
        success: true, 
        data: {
          id: resultData.id, 
          value: resultData.value, 
          label: resultData.label, 
          is_system: resultData.is_system 
        }
      };
    } catch (error) {
      console.error("Error in createStatusOption:", error);
      return { success: false, error };
    }
  },
  
  /**
   * Update an existing status option
   */
  async updateStatusOption(id: string, status: { value: string; label: string }): Promise<{ success: boolean; error?: any; data?: StatusOption }> {
    try {
      // Normalize the value (lowercase, no spaces)
      const normalizedValue = status.value.toLowerCase().replace(/\s+/g, '_');
      
      // Update the status option using our custom function
      const { data, error } = await supabase.rpc('update_status_option', {
        p_id: id,
        p_value: normalizedValue,
        p_label: status.label
      });
      
      if (error) {
        console.error("Error updating status option:", error);
        return { success: false, error };
      }
      
      // Handle the returned data appropriately - ensure we're taking the first item if array is returned
      let resultData: StatusOption;
      
      if (Array.isArray(data)) {
        if (data.length === 0) {
          return { success: false, error: "No data returned from operation" };
        }
        resultData = data[0];
      } else {
        resultData = data;
      }
      
      return { 
        success: true, 
        data: {
          id: resultData.id,
          value: resultData.value,
          label: resultData.label,
          is_system: resultData.is_system
        }
      };
    } catch (error) {
      console.error("Error in updateStatusOption:", error);
      return { success: false, error };
    }
  },
  
  /**
   * Check if a status option is in use by any candidate
   */
  async checkStatusInUse(value: string): Promise<{ inUse: boolean; count: number }> {
    try {
      const { count, error } = await supabase
        .from("candidate_applications")
        .select("id", { count: 'exact', head: true })
        .eq("status", value);
        
      if (error) {
        console.error("Error checking if status is in use:", error);
        return { inUse: false, count: 0 };
      }
      
      return { inUse: count !== null && count > 0, count: count || 0 };
    } catch (error) {
      console.error("Error in checkStatusInUse:", error);
      return { inUse: false, count: 0 };
    }
  },
  
  /**
   * Delete a status option
   */
  async deleteStatusOption(id: string, value: string): Promise<{ success: boolean; error?: any; inUse?: boolean }> {
    try {
      // Check if the status is in use
      const { inUse, count } = await this.checkStatusInUse(value);
      
      if (inUse) {
        return { 
          success: false, 
          error: `Cannot delete status that is in use by ${count} candidate(s)`,
          inUse: true
        };
      }
      
      // Delete the status option using our custom function
      const { data: success, error } = await supabase.rpc('delete_status_option', {
        p_id: id
      });
      
      if (error) {
        console.error("Error deleting status option:", error);
        return { success: false, error };
      }
      
      return { success: !!success };
    } catch (error) {
      console.error("Error in deleteStatusOption:", error);
      return { success: false, error };
    }
  }
};
