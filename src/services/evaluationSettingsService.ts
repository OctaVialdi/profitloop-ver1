
import { supabase } from "@/integrations/supabase/client";
import { 
  EvaluationCategory, 
  EvaluationCriterion 
} from "./candidateService";

/**
 * Service for managing evaluation settings (categories and criteria)
 */
export const evaluationSettingsService = {
  /**
   * Fetches all evaluation categories without criteria
   */
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

  /**
   * Creates a new evaluation category
   */
  async createCategory(
    name: string, 
    description?: string
  ): Promise<{ success: boolean, data?: EvaluationCategory, error?: any }> {
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

  /**
   * Updates an existing evaluation category
   */
  async updateCategory(
    id: string, 
    updates: Partial<Omit<EvaluationCategory, 'id' | 'criteria'>>
  ): Promise<{ success: boolean, data?: EvaluationCategory, error?: any }> {
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

  /**
   * Deletes an evaluation category
   */
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

  /**
   * Updates the display order of categories
   */
  async updateCategoryOrder(
    categories: { id: string, display_order: number }[]
  ): Promise<{ success: boolean, error?: any }> {
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

  /**
   * Fetches criteria for a specific category
   */
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

  /**
   * Creates a new evaluation criterion
   */
  async createCriterion(
    categoryId: string, 
    question: string
  ): Promise<{ success: boolean, data?: EvaluationCriterion, error?: any }> {
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

  /**
   * Updates an existing evaluation criterion
   */
  async updateCriterion(
    id: string, 
    updates: Partial<Omit<EvaluationCriterion, 'id'>>
  ): Promise<{ success: boolean, data?: EvaluationCriterion, error?: any }> {
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

  /**
   * Deletes an evaluation criterion
   */
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

  /**
   * Updates the display order of criteria
   */
  async updateCriteriaOrder(
    criteria: { id: string, display_order: number }[]
  ): Promise<{ success: boolean, error?: any }> {
    try {
      // Update each criterion separately
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
  }
};
