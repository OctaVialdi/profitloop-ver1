
import { supabase } from "@/integrations/supabase/client";

/**
 * Mock subscription service for handling subscription related operations
 */
export const subscriptionService = {
  getSubscriptionPlans: async () => {
    // Mock subscription plans data
    return [
      {
        id: "basic-plan",
        name: "Basic",
        slug: "basic",
        max_members: 5,
        price: 0,
        features: {
          storage: "1GB",
          members: "5 members",
          support: "Email support"
        },
        is_active: true
      },
      {
        id: "standard-plan",
        name: "Standard",
        slug: "standard",
        max_members: 20,
        price: 299000,
        popular: true,
        features: {
          storage: "10GB",
          members: "20 members",
          support: "Priority support",
          advanced_analytics: true
        },
        is_active: true
      },
      {
        id: "premium-plan",
        name: "Premium",
        slug: "premium",
        max_members: 50,
        price: 599000,
        features: {
          storage: "100GB",
          members: "50 members",
          support: "24/7 support",
          advanced_analytics: true,
          custom_domain: true,
          api_access: true
        },
        is_active: true
      }
    ];
  },
  
  getCurrentPlan: async (organizationId: string) => {
    // Mock current plan data
    return {
      id: "standard-plan",
      name: "Standard",
      price: 299000,
      max_members: 20,
      features: {
        storage: "10GB",
        members: "20 members",
        support: "Priority support",
        advanced_analytics: true
      },
      is_active: true
    };
  },
  
  updateSubscription: async (organizationId: string, planId: string) => {
    // Mock update subscription response
    return { 
      success: true, 
      message: "Subscription updated successfully" 
    };
  },
  
  cancelSubscription: async (organizationId: string) => {
    // Mock cancel subscription response
    return { 
      success: true, 
      message: "Subscription cancelled successfully" 
    };
  },
  
  checkAndUpdateTrialStatus: async (organizationId: string) => {
    // Mock trial status check
    return { 
      success: true, 
      updated: false, 
      message: "Trial status is up to date" 
    };
  },
  
  fixOrganizationTrialPeriod: async (organizationId: string) => {
    // Mock fix trial period
    return { 
      success: true, 
      message: "Trial period fixed successfully" 
    };
  },
  
  requestTrialExtension: async (organizationId: string, reason: string) => {
    // Mock trial extension request
    return { 
      success: true, 
      message: "Trial extension requested successfully" 
    };
  }
};
