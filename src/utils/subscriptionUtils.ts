
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
