
import { supabase } from "@/integrations/supabase/client";
import { Organization } from "@/types/organization";

export const subscriptionService = {
  getSubscriptionStatus: async (organizationId: string) => {
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
      console.error("Error fetching subscription status:", error);
      return {
        status: 'unknown',
        planId: '',
        trialEndDate: '',
        trialStartDate: '',
        trialExpired: false
      };
    }
  },
  
  checkAndUpdateTrialStatus: async (organizationId: string) => {
    try {
      // Get current organization data
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('trial_end_date, trial_expired')
        .eq('id', organizationId)
        .single();
      
      if (orgError) throw orgError;
      
      // Check if trial has expired but not marked as such
      if (org && new Date(org.trial_end_date) < new Date() && !org.trial_expired) {
        // Update trial status
        const { error: updateError } = await supabase
          .from('organizations')
          .update({
            trial_expired: true,
            subscription_status: 'expired'
          })
          .eq('id', organizationId);
          
        if (updateError) throw updateError;
        
        return {
          updated: true,
          status: 'expired',
          message: 'Trial has expired and status has been updated.'
        };
      }
      
      return {
        updated: false,
        status: org.trial_expired ? 'expired' : 'active',
        message: 'No update needed.'
      };
    } catch (error) {
      console.error("Error checking trial status:", error);
      return {
        updated: false,
        status: 'unknown',
        message: 'Error checking trial status.'
      };
    }
  },
  
  fixOrganizationTrialPeriod: async (organizationId: string) => {
    try {
      // Get current organization data
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('trial_start_date, trial_end_date')
        .eq('id', organizationId)
        .single();
      
      if (orgError) throw orgError;
      
      let trialStartDate = org.trial_start_date;
      let trialEndDate = org.trial_end_date;
      let updated = false;
      
      // Fix missing trial start date
      if (!trialStartDate) {
        trialStartDate = new Date().toISOString();
        updated = true;
      }
      
      // Fix missing trial end date
      if (!trialEndDate) {
        // Set trial end date to 14 days after start date
        const endDate = new Date(trialStartDate);
        endDate.setDate(endDate.getDate() + 14);
        trialEndDate = endDate.toISOString();
        updated = true;
      }
      
      if (updated) {
        // Update organization with fixed dates
        const { error: updateError } = await supabase
          .from('organizations')
          .update({
            trial_start_date: trialStartDate,
            trial_end_date: trialEndDate,
            trial_expired: false,
            subscription_status: 'trial'
          })
          .eq('id', organizationId);
          
        if (updateError) throw updateError;
      }
      
      return {
        success: true,
        updated,
        message: updated ? 'Trial period has been fixed.' : 'No update needed.'
      };
    } catch (error) {
      console.error("Error fixing trial period:", error);
      return {
        success: false,
        updated: false,
        message: 'Error fixing trial period.'
      };
    }
  },
  
  sendTrialReminderEmail: async (organizationId: string, email: string) => {
    // We'll implement this function as a placeholder
    // In a real implementation, you would call an edge function to send emails
    console.log(`Would send trial reminder email to ${email} for organization ${organizationId}`);
    return { success: true, message: 'Email notification would be sent in production.' };
  },
  
  // Add the missing requestTrialExtension function
  requestTrialExtension: async (organizationId: string, reason: string) => {
    try {
      // In a real implementation, this would call an API or edge function
      // For now, we'll just log it and return a success message
      console.log(`Trial extension requested for org ${organizationId} with reason: ${reason}`);
      
      // Create a notification for admins
      const { error } = await supabase
        .from('notifications')
        .insert({
          organization_id: organizationId,
          title: 'Trial Extension Requested',
          message: `A trial extension has been requested. Reason: ${reason}`,
          type: 'info',
          user_id: null, // System notification
        });
        
      if (error) throw error;
      
      return {
        success: true,
        message: 'Your trial extension request has been submitted. Our team will review it shortly.'
      };
    } catch (error) {
      console.error("Error requesting trial extension:", error);
      return {
        success: false,
        message: 'Failed to submit trial extension request. Please try again later.'
      };
    }
  },
  
  // Add the missing function for subscription plans
  getSubscriptionPlans: async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price');
        
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      return { data: null, error };
    }
  }
};
