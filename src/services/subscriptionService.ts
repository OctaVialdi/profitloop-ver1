
import { supabase } from "@/integrations/supabase/client";

/**
 * Force updates the trial status for the current organization
 * This is useful when we know the trial has expired but the flag hasn't been updated
 */
export async function checkAndUpdateTrialStatus(organizationId: string): Promise<boolean> {
  try {
    // Get organization details
    const { data: orgData } = await supabase
      .from('organizations')
      .select('trial_end_date, subscription_status')
      .eq('id', organizationId)
      .single();
      
    if (!orgData) return false;
    
    // Check if trial has expired based on date
    const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
    const now = new Date();
    const isTrialExpiredByDate = trialEndDate && trialEndDate < now;
    
    // If trial is expired by date but not flagged, update it
    if (isTrialExpiredByDate && orgData.subscription_status === 'trial') {
      console.log("Trial has expired by date but not flagged. Updating status.");
      const { error } = await supabase
        .from('organizations')
        .update({ subscription_status: 'expired' })
        .eq('id', organizationId);
        
      if (error) {
        console.error("Error updating subscription_status flag:", error);
        return false;
      }
      
      // Also invoke edge function to perform any additional processing
      try {
        await supabase.functions.invoke('check-trial-expiration');
      } catch (err) {
        console.error("Failed to invoke check-trial-expiration:", err);
        // Continue even if the edge function fails
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error in checkAndUpdateTrialStatus:", error);
    return false;
  }
}

/**
 * Manually trigger the edge function to check trial expirations
 */
export async function triggerTrialExpirationCheck(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('check-trial-expiration');
    
    if (error) {
      console.error("Error triggering trial expiration check:", error);
      return false;
    }
    
    console.log("Trial expiration check triggered:", data);
    return true;
  } catch (error) {
    console.error("Error in triggerTrialExpirationCheck:", error);
    return false;
  }
}
