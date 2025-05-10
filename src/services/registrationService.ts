
import { supabase } from "@/integrations/supabase/client";

/**
 * Registration service that handles setting up a user's account and organization
 */
export const registrationService = {
  /**
   * Set up trial for a new organization
   * @param organizationId The organization ID
   * @returns Success status
   */
  setupTrialPeriod: async (organizationId: string): Promise<boolean> => {
    try {
      // Set trial start date to now and end date to 14 days later
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 day trial period
      
      // Update the organization with trial dates
      const { error } = await supabase
        .from('organizations')
        .update({
          trial_start_date: trialStartDate.toISOString(),
          trial_end_date: trialEndDate.toISOString(),
          trial_expired: false,
          subscription_status: 'trial'
        })
        .eq('id', organizationId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error setting up trial period:", error);
      return false;
    }
  }
};
