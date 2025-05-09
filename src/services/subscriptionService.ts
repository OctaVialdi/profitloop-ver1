
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

/**
 * Force updates the trial status for the current organization
 * This is useful when we know the trial has expired but the flag hasn't been updated
 */
export async function checkAndUpdateTrialStatus(organizationId: string): Promise<boolean> {
  try {
    // Get organization details
    const { data: orgData } = await supabase
      .from('organizations')
      .select('trial_end_date, trial_expired, subscription_status')
      .eq('id', organizationId)
      .single();
      
    if (!orgData) return false;
    
    // Check if trial has expired based on date
    const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
    const now = new Date();
    const isTrialExpiredByDate = trialEndDate && trialEndDate < now;
    
    // If trial is expired by date but not flagged, update it
    if (isTrialExpiredByDate && (orgData.subscription_status === 'trial' || !orgData.trial_expired)) {
      console.log("Trial has expired by date but not flagged. Updating flag.");
      const { error } = await supabase
        .from('organizations')
        .update({ 
          trial_expired: true,
          subscription_status: 'expired' 
        })
        .eq('id', organizationId);
        
      if (error) {
        console.error("Error updating trial_expired flag:", error);
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

/**
 * Request a trial extension
 */
export async function requestTrialExtension(
  organizationId: string, 
  reason: string, 
  contactEmail: string
): Promise<boolean> {
  try {
    // Create a notification for admins (this would normally go to system administrators)
    const { error } = await supabase
      .from('notifications')
      .insert([
        {
          organization_id: organizationId,
          title: 'Trial Extension Request',
          message: `A trial extension has been requested. Reason: ${reason}. Contact: ${contactEmail}`,
          user_id: (await supabase.auth.getUser()).data.user?.id || '',
          type: 'info'
        }
      ]);

    if (error) throw error;
    
    toast.success("Your trial extension request has been submitted. We'll contact you soon.");
    return true;
  } catch (error) {
    console.error("Error requesting trial extension:", error);
    toast.error("Failed to submit trial extension request. Please try again.");
    return false;
  }
}
