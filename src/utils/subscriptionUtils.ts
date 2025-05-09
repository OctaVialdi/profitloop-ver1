
import { supabase } from "@/integrations/supabase/client";
import { Organization } from "@/types/organization";

/**
 * Tracks a subscription-related event using the track-event edge function
 * @param eventType The type of event to track
 * @param organizationId The organization ID
 * @param additionalData Any additional data to include
 */
export async function trackSubscriptionEvent(
  eventType: string, 
  organizationId: string, 
  additionalData?: Record<string, any>
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('track-event', {
      body: {
        event_type: eventType,
        organization_id: organizationId,
        additional_data: additionalData
      }
    });
    
    if (error) {
      console.error("Error tracking subscription event:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to track subscription event:", error);
    return false;
  }
}

/**
 * Requests an extension for an organization's trial period
 */
export async function requestTrialExtension(
  organizationId: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Update organization with extension request
    const { error } = await supabase
      .from('organizations')
      .update({
        trial_extension_requested: true,
        trial_extension_reason: reason
      })
      .eq('id', organizationId);
    
    if (error) throw error;
    
    // Log the request in audit logs
    await supabase
      .from('subscription_audit_logs')
      .insert({
        organization_id: organizationId,
        action: 'trial_extension_requested',
        user_id: (await supabase.auth.getUser()).data.user?.id,
        data: {
          reason,
          requested_at: new Date().toISOString()
        }
      });
    
    // Track the event
    await trackSubscriptionEvent('trial_extension_requested', organizationId, { reason });
    
    return { success: true, message: "Permintaan perpanjangan trial berhasil dikirim" };
  } catch (error) {
    console.error("Error requesting trial extension:", error);
    return { success: false, message: "Gagal mengirim permintaan perpanjangan trial" };
  }
}

/**
 * Checks if an organization's trial is about to expire and returns appropriate messaging
 */
export function getTrialStatus(organization: Organization | null) {
  if (!organization) return { isWarning: false, message: "" };
  
  const now = new Date();
  const trialEndDate = organization.trial_end_date ? new Date(organization.trial_end_date) : null;
  
  if (!trialEndDate) return { isWarning: false, message: "" };
  
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) {
    return { 
      isWarning: true, 
      message: "Masa trial Anda telah berakhir. Berlangganan sekarang untuk terus menggunakan semua fitur.",
      isExpired: true,
      daysLeft: 0
    };
  }
  
  if (diffDays <= 3) {
    return { 
      isWarning: true, 
      message: `Masa trial Anda akan berakhir dalam ${diffDays} hari. Berlangganan segera untuk menghindari gangguan layanan.`,
      isExpired: false,
      daysLeft: diffDays
    };
  }
  
  return { isWarning: false, message: "", isExpired: false, daysLeft: diffDays };
}

/**
 * Check if user has access to premium features
 * @param organization The organization object
 * @returns boolean True if user has access to premium features
 */
export function hasPremiumAccess(organization: Organization | null): boolean {
  if (!organization) return false;
  
  // If they have a paid subscription
  if (organization.subscription_status === 'active' && 
      organization.subscription_plan_id && 
      organization.subscription_plan_id !== 'basic') {
    return true;
  }
  
  // If they are in an active trial period
  if (organization.subscription_status === 'trial' && !organization.trial_expired) {
    const now = new Date();
    const trialEndDate = organization.trial_end_date ? new Date(organization.trial_end_date) : null;
    if (trialEndDate && trialEndDate > now) {
      return true;
    }
  }
  
  // If they are in grace period after trial expiration
  if (organization.subscription_status === 'expired' && organization.grace_period_end) {
    const now = new Date();
    const gracePeriodEnd = new Date(organization.grace_period_end);
    if (gracePeriodEnd > now) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if the trial expiration should be reminded
 * @returns Object with reminder info
 */
export function shouldRemindTrialExpiration(organization: Organization | null): 
  { shouldRemind: boolean; severity: 'low' | 'medium' | 'high'; daysLeft: number } {
  
  if (!organization || !organization.trial_end_date) {
    return { shouldRemind: false, severity: 'low', daysLeft: 0 };
  }
  
  // If subscription is active, no need for reminders
  if (organization.subscription_status === 'active') {
    return { shouldRemind: false, severity: 'low', daysLeft: 0 };
  }
  
  const now = new Date();
  const trialEndDate = new Date(organization.trial_end_date);
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Already expired
  if (diffDays <= 0) {
    return { shouldRemind: true, severity: 'high', daysLeft: 0 };
  }
  
  // Less than a day left (show in hours)
  if (diffDays === 1) {
    return { shouldRemind: true, severity: 'high', daysLeft: 1 };
  }
  
  // Less than 3 days left
  if (diffDays <= 3) {
    return { shouldRemind: true, severity: 'medium', daysLeft: diffDays };
  }
  
  // Less than 7 days left
  if (diffDays <= 7) {
    return { shouldRemind: true, severity: 'low', daysLeft: diffDays };
  }
  
  return { shouldRemind: false, severity: 'low', daysLeft: diffDays };
}

/**
 * Force updates the trial status for the current organization
 * This is useful when we know the trial has expired but the flag hasn't been updated
 */
export async function checkAndUpdateTrialStatus(organizationId: string): Promise<boolean> {
  try {
    // Get organization details
    const { data: orgData } = await supabase
      .from('organizations')
      .select('trial_end_date, trial_expired')
      .eq('id', organizationId)
      .single();
      
    if (!orgData) return false;
    
    // Check if trial has expired based on date
    const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
    const now = new Date();
    const isTrialExpiredByDate = trialEndDate && trialEndDate < now;
    
    // If trial is expired by date but not flagged, update it
    if (isTrialExpiredByDate && !orgData.trial_expired) {
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
