import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { subscriptionAnalyticsService } from "./subscriptionAnalyticsService";

/**
 * Force updates the trial status for the current organization
 * This is useful when we know the trial has expired but the flag hasn't been updated
 */
export async function checkAndUpdateTrialStatus(organizationId: string): Promise<boolean> {
  try {
    // Get organization details
    const { data: orgData } = await supabase
      .from('organizations')
      .select('trial_end_date, trial_expired, subscription_status, trial_start_date')
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
    
    // If trial_start_date is missing, set it to 14 days before trial_end_date
    if (!orgData.trial_start_date && trialEndDate) {
      const calculatedStartDate = new Date(trialEndDate);
      calculatedStartDate.setDate(calculatedStartDate.getDate() - 14); // 14-day trial
      
      const { error } = await supabase
        .from('organizations')
        .update({ 
          trial_start_date: calculatedStartDate.toISOString()
        })
        .eq('id', organizationId);
      
      if (error) {
        console.error("Error updating trial_start_date:", error);
      }
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

/**
 * Update existing organization to ensure the correct trial period
 * This will fix organizations with inconsistent trial periods
 */
export async function fixOrganizationTrialPeriod(organizationId: string): Promise<boolean> {
  try {
    // Get organization details
    const { data: orgData } = await supabase
      .from('organizations')
      .select('trial_end_date, trial_start_date')
      .eq('id', organizationId)
      .single();
      
    if (!orgData) return false;
    
    const trialStartDate = orgData.trial_start_date ? new Date(orgData.trial_start_date) : new Date();
    
    // Calculate the correct end date (14 days from start date)
    const correctEndDate = new Date(trialStartDate);
    correctEndDate.setDate(correctEndDate.getDate() + 14); // 14-day trial
    
    // Update the organization with the correct trial period
    const { error } = await supabase
      .from('organizations')
      .update({ 
        trial_end_date: correctEndDate.toISOString(),
        trial_start_date: orgData.trial_start_date || trialStartDate.toISOString()
      })
      .eq('id', organizationId);
      
    if (error) {
      console.error("Error fixing trial period:", error);
      return false;
    }
    
    console.log("Trial period fixed for organization:", organizationId);
    return true;
  } catch (error) {
    console.error("Error in fixOrganizationTrialPeriod:", error);
    return false;
  }
}

/**
 * Send payment failure notification
 */
export async function sendPaymentFailureNotification(
  organizationId: string,
  planId: string,
  reason: string
): Promise<boolean> {
  try {
    // Create a notification for admins
    const { error } = await supabase
      .from('notifications')
      .insert([
        {
          organization_id: organizationId,
          title: 'Pembayaran Gagal',
          message: `Pembayaran untuk paket berlangganan Anda gagal. Alasan: ${reason}`,
          type: 'error',
          action_url: '/settings/subscription'
        }
      ]);

    if (error) throw error;
    
    // Track payment failure event
    subscriptionAnalyticsService.trackPaymentFailed(planId, reason, organizationId);
    
    return true;
  } catch (error) {
    console.error("Error sending payment failure notification:", error);
    return false;
  }
}

/**
 * Send subscription confirmation notification
 */
export async function sendSubscriptionConfirmation(
  organizationId: string,
  planId: string
): Promise<boolean> {
  try {
    // Create a notification for all members
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('organization_id', organizationId);
      
    if (!profiles) return false;
    
    const notifications = profiles.map(profile => ({
      user_id: profile.id,
      organization_id: organizationId,
      title: 'Berlangganan Berhasil',
      message: 'Paket berlangganan Anda telah aktif. Terima kasih telah berlangganan!',
      type: 'success',
      action_url: '/settings/subscription'
    }));
    
    if (notifications.length > 0) {
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);
        
      if (error) throw error;
    }
    
    // Track subscription activated event
    subscriptionAnalyticsService.trackSubscriptionActivated(planId, organizationId);
    subscriptionAnalyticsService.trackEmailNotificationSent('subscription_confirmation', organizationId);
    
    return true;
  } catch (error) {
    console.error("Error sending subscription confirmation:", error);
    return false;
  }
}
