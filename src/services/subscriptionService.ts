
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/organization";

// Mock subscription plans for development
const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "price_1NxLSZMNN",
    name: "Standard Plan",
    slug: "standard_plan",
    price: 199000,
    max_members: 10,
    features: {
      employees: 10,
      recruitment: true,
      payroll: true,
      reports: false,
      api_access: false
    },
    is_active: true,
    created_at: new Date().toISOString(),
    direct_payment_url: "https://checkout.example.com/standard"
  },
  {
    id: "price_1NxLTmMNN",
    name: "Professional Plan",
    slug: "professional_plan",
    price: 399000,
    max_members: 25,
    features: {
      employees: 25,
      recruitment: true,
      payroll: true,
      reports: true,
      api_access: false
    },
    is_active: true,
    created_at: new Date().toISOString(),
    direct_payment_url: "https://checkout.example.com/professional"
  },
  {
    id: "price_1NxLUuMNN",
    name: "Enterprise Plan",
    slug: "enterprise_plan",
    price: 799000,
    max_members: 100,
    features: {
      employees: 100,
      recruitment: true,
      payroll: true,
      reports: true,
      api_access: true
    },
    is_active: true,
    created_at: new Date().toISOString(),
    direct_payment_url: "https://checkout.example.com/enterprise"
  }
];

export const subscriptionService = {
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      // In a real implementation, this would fetch from the database
      // return MOCK_SUBSCRIPTION_PLANS for development
      return MOCK_SUBSCRIPTION_PLANS;
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      return [];
    }
  },
  
  checkAndUpdateTrialStatus: async (organizationId: string): Promise<void> => {
    console.log(`Checking and updating trial status for organization: ${organizationId}`);
    // This would actually check if the trial has expired and update the organization
    // Just a mock implementation for now
  },
  
  fixOrganizationTrialPeriod: async (organizationId: string): Promise<void> => {
    console.log(`Fixing trial period for organization: ${organizationId}`);
    // This would fix any inconsistencies in the trial period
    // Just a mock implementation for now
  },
  
  getCurrentPlan: async (organizationId: string): Promise<SubscriptionPlan | null> => {
    try {
      const { data: organization } = await supabase
        .from('organizations')
        .select('subscription_plan_id')
        .eq('id', organizationId)
        .maybeSingle();
      
      if (organization?.subscription_plan_id) {
        // In a real app, this would fetch from the database
        // For now, return a mock plan
        return MOCK_SUBSCRIPTION_PLANS[0];
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching current plan:", error);
      return null;
    }
  }
};
