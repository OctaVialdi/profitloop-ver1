
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/organization";

// Mock subscription plans
const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    slug: "basic",
    price: 9900,
    max_members: 5,
    features: {
      storage: "5 GB",
      members: "Up to 5 members",
      support: "Email support",
      advanced_analytics: false
    },
    is_active: true
  },
  {
    id: "professional",
    name: "Professional",
    slug: "professional",
    price: 19900,
    max_members: 20,
    features: {
      storage: "20 GB",
      members: "Up to 20 members",
      support: "Priority support",
      advanced_analytics: true
    },
    is_active: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    slug: "enterprise",
    price: 49900,
    max_members: 50,
    features: {
      storage: "100 GB",
      members: "Up to 50 members",
      support: "24/7 dedicated support",
      advanced_analytics: true
    },
    is_active: true
  }
];

export const subscriptionService = {
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    // Return mock data
    return mockSubscriptionPlans;
  },
  
  checkAndUpdateTrialStatus: async (organizationId: string): Promise<{ success: boolean, message: string }> => {
    try {
      // Mock implementation that would normally check the trial status and update it if needed
      return {
        success: true,
        message: "Trial status checked and updated"
      };
    } catch (error) {
      console.error("Error checking trial status:", error);
      return {
        success: false,
        message: "Failed to check trial status"
      };
    }
  },
  
  fixOrganizationTrialPeriod: async (organizationId: string): Promise<{ success: boolean, message: string }> => {
    try {
      // Mock implementation that would normally fix trial issues
      return {
        success: true,
        message: "Trial period has been adjusted based on your activity"
      };
    } catch (error) {
      console.error("Error fixing trial period:", error);
      return {
        success: false,
        message: "Failed to fix trial period"
      };
    }
  },
  
  requestTrialExtension: async (organizationId: string, reason: string): Promise<{ success: boolean, message: string }> => {
    try {
      // Mock implementation for trial extension requests
      return {
        success: true,
        message: "Your trial extension request has been submitted"
      };
    } catch (error) {
      console.error("Error requesting trial extension:", error);
      return {
        success: false,
        message: "Failed to submit trial extension request"
      };
    }
  },
  
  sendTrialReminderEmail: async (organizationId: string, email: string): Promise<{ success: boolean, message: string }> => {
    try {
      // Mock implementation for sending trial reminder emails
      return {
        success: true,
        message: "Reminder email sent successfully"
      };
    } catch (error) {
      console.error("Error sending reminder email:", error);
      return {
        success: false,
        message: "Failed to send reminder email"
      };
    }
  },
  
  createCheckout: async (planId: string, organizationId: string): Promise<string> => {
    // Mock implementation for creating a checkout URL
    return `https://checkout.example.com/${planId}/${organizationId}`;
  }
};
