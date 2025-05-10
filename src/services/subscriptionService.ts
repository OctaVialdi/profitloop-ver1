
import { SubscriptionPlan } from "@/types/organization";
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing subscriptions
 */
export const subscriptionService = {
  /**
   * Get subscription status for an organization
   */
  getSubscriptionStatus: async (organizationId: string) => {
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("subscription_status, subscription_plan_id, trial_end_date, trial_start_date, trial_expired")
        .eq("id", organizationId)
        .single();

      if (error) {
        throw error;
      }

      return {
        status: data.subscription_status,
        planId: data.subscription_plan_id,
        trialEndDate: data.trial_end_date,
        trialStartDate: data.trial_start_date,
        trialExpired: data.trial_expired,
      };
    } catch (error) {
      console.error("Error getting subscription status:", error);
      return {
        status: "unknown",
        planId: null,
        trialEndDate: null,
        trialStartDate: null,
        trialExpired: false,
      };
    }
  },

  /**
   * Check and update trial status
   */
  checkAndUpdateTrialStatus: async (organizationId: string) => {
    try {
      // For demo purposes, return fixed data
      return {
        success: true,
        updated: false,
        message: "Trial status is up to date",
      };
    } catch (error) {
      console.error("Error checking trial status:", error);
      return {
        success: false,
        updated: false,
        message: "Error checking trial status",
      };
    }
  },

  /**
   * Fix organization trial period
   */
  fixOrganizationTrialPeriod: async (organizationId: string) => {
    try {
      // For demo purposes, return fixed data
      return {
        success: true,
        message: "Trial period fixed successfully",
      };
    } catch (error) {
      console.error("Error fixing trial period:", error);
      return {
        success: false,
        message: "Error fixing trial period",
      };
    }
  },

  /**
   * Send trial reminder email
   */
  sendTrialReminderEmail: async (organizationId: string, daysLeft: number) => {
    try {
      // For demo purposes, return fixed data
      console.log(`Sending trial reminder email for org ${organizationId}. ${daysLeft} days left.`);
      return {
        success: true,
        message: "Trial reminder email sent successfully",
      };
    } catch (error) {
      console.error("Error sending trial reminder email:", error);
      return {
        success: false,
        message: "Error sending trial reminder email",
      };
    }
  },
  
  /**
   * Get subscription plans
   */
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    // Mock data for subscription plans
    return [
      {
        id: "starter-plan",
        name: "Starter",
        slug: "starter",
        price: 99000,
        max_members: 5,
        features: {
          storage: "5GB",
          members: "5 members",
          support: "Email support",
          advanced_analytics: false
        },
        is_active: true
      },
      {
        id: "professional-plan",
        name: "Professional",
        slug: "professional",
        price: 299000,
        max_members: 20,
        features: {
          storage: "20GB",
          members: "20 members",
          support: "Priority support",
          advanced_analytics: true
        },
        is_active: true
      },
      {
        id: "enterprise-plan",
        name: "Enterprise",
        slug: "enterprise",
        price: 999000,
        max_members: 100,
        features: {
          storage: "100GB",
          members: "Unlimited members",
          support: "Dedicated support",
          advanced_analytics: true
        },
        is_active: true
      }
    ];
  }
};
