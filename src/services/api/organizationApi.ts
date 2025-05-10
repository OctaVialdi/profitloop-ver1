
import { supabase } from "@/integrations/supabase/client";
import { Organization } from "@/types/organization";

export const organizationApi = {
  /**
   * Create a new organization
   */
  createOrganization: async (organizationData: Partial<Organization>) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert([organizationData])
        .select();

      if (error) {
        console.error("Error creating organization:", error);
        throw error;
      }

      return data?.[0] as Organization;
    } catch (error) {
      console.error("Error in createOrganization:", error);
      throw error;
    }
  },

  /**
   * Update an organization
   */
  updateOrganization: async (id: string, updates: Partial<Organization>) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        console.error("Error updating organization:", error);
        throw error;
      }

      return data?.[0] as Organization;
    } catch (error) {
      console.error("Error in updateOrganization:", error);
      throw error;
    }
  },

  /**
   * Get organization by ID
   */
  getOrganizationById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching organization:", error);
        throw error;
      }

      return data as Organization;
    } catch (error) {
      console.error("Error in getOrganizationById:", error);
      throw error;
    }
  },

  /**
   * Update organization subscription status
   */
  updateSubscriptionStatus: async (
    id: string, 
    status: string, 
    planId?: string
  ) => {
    try {
      const updates: Partial<Organization> = { 
        subscription_status: status 
      };
      
      if (planId) {
        updates.subscription_plan_id = planId;
      }
      
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        console.error("Error updating subscription status:", error);
        throw error;
      }

      return data?.[0] as Organization;
    } catch (error) {
      console.error("Error in updateSubscriptionStatus:", error);
      throw error;
    }
  }
};
