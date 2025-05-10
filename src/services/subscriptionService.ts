
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const subscriptionService = {
  /**
   * Get subscription status
   */
  async getSubscriptionStatus(organizationId: string) {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('subscription_status, subscription_plan_id, trial_end_date, trial_start_date, trial_expired')
        .eq('id', organizationId)
        .single();
        
      if (error) throw error;
      
      return {
        status: data.subscription_status,
        planId: data.subscription_plan_id,
        trialEndDate: data.trial_end_date,
        trialStartDate: data.trial_start_date,
        trialExpired: data.trial_expired
      };
    } catch (error) {
      console.error("Error getting subscription status:", error);
      return null;
    }
  },
  
  /**
   * Check and update trial status if needed
   */
  async checkAndUpdateTrialStatus(organizationId: string) {
    try {
      // Get subscription info
      const { data: org, error } = await supabase
        .from('organizations')
        .select('trial_end_date, trial_expired, subscription_status')
        .eq('id', organizationId)
        .single();
        
      if (error) throw error;
      
      // If no trial end date, nothing to do
      if (!org.trial_end_date) return;
      
      // Check if trial is expired but not marked as such
      const trialEndDate = new Date(org.trial_end_date);
      const now = new Date();
      
      if (trialEndDate <= now && !org.trial_expired) {
        // Update trial status
        const { error: updateError } = await supabase
          .from('organizations')
          .update({
            trial_expired: true,
            subscription_status: 'trial_expired'
          })
          .eq('id', organizationId);
          
        if (updateError) throw updateError;
        
        return { updated: true };
      }
      
      return { updated: false };
    } catch (error) {
      console.error("Error checking trial status:", error);
      return { updated: false, error };
    }
  },
  
  /**
   * Fix organization trial period
   */
  async fixOrganizationTrialPeriod(organizationId: string) {
    try {
      // Get organization data
      const { data: org, error } = await supabase
        .from('organizations')
        .select('trial_end_date, trial_expired, subscription_status, created_at')
        .eq('id', organizationId)
        .single();
        
      if (error) throw error;
      
      // Calculate if trial should be extended
      const createdAt = new Date(org.created_at);
      const now = new Date();
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
      
      // If organization is very new (< 3 days) and has expired trial, fix it
      if (daysSinceCreation < 3 && org.trial_expired) {
        // Set trial to 14 days from now
        const newTrialEndDate = new Date();
        newTrialEndDate.setDate(now.getDate() + 14);
        
        const { error: updateError } = await supabase
          .from('organizations')
          .update({
            trial_expired: false,
            trial_end_date: newTrialEndDate.toISOString(),
            subscription_status: 'trialing'
          })
          .eq('id', organizationId);
          
        if (updateError) throw updateError;
        
        return { success: true, message: "Trial period has been extended!" };
      }
      
      // For demo purposes, always extend trial
      // In production, you would have more logic here
      const newTrialEndDate = new Date();
      newTrialEndDate.setDate(now.getDate() + 7);
      
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          trial_expired: false,
          trial_end_date: newTrialEndDate.toISOString(),
          subscription_status: 'trialing'
        })
        .eq('id', organizationId);
        
      if (updateError) throw updateError;
      
      return { success: true, message: "Trial period has been extended!" };
    } catch (error) {
      console.error("Error fixing trial period:", error);
      return { success: false, message: "Could not extend trial period." };
    }
  },
  
  /**
   * Send trial reminder email
   */
  async sendTrialReminderEmail(organizationId: string, reminderType: string) {
    try {
      // In a real app, this would call an API to send an email
      // For now, just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log to analytics
      console.log(`Trial reminder email sent for ${organizationId}, type: ${reminderType}`);
      
      return { success: true };
    } catch (error) {
      console.error("Error sending reminder:", error);
      return { success: false, error };
    }
  },
  
  /**
   * Request trial extension
   */
  async requestTrialExtension(organizationId: string, reason: string) {
    try {
      // In a real app, this would call an API to request an extension
      // For now, just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, auto-approve the extension
      const now = new Date();
      const extendedDate = new Date();
      extendedDate.setDate(now.getDate() + 7);
      
      const { error } = await supabase
        .from('organizations')
        .update({
          trial_expired: false,
          trial_end_date: extendedDate.toISOString(),
          subscription_status: 'trialing'
        })
        .eq('id', organizationId);
        
      if (error) throw error;
      
      return { success: true, message: "Trial extended successfully!" };
    } catch (error) {
      console.error("Error requesting extension:", error);
      return { success: false, error };
    }
  }
};
