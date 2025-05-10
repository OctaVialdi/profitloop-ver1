
import { supabase } from "@/integrations/supabase/client";
import { Organization, SubscriptionPlan } from "@/types/organization";
import { OrganizationFormData } from "@/types/onboarding";

export async function getOrganization(organizationId: string): Promise<Organization | null> {
  try {
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .maybeSingle();
    
    if (orgError) {
      console.error("Organization fetch error:", orgError);
      throw orgError;
    }
    
    if (!orgData) {
      console.error("No organization found with ID:", organizationId);
      return null;
    }
    
    // Ensure the organization has all required properties
    return {
      ...orgData as Organization,
      trial_expired: orgData.trial_expired !== null ? orgData.trial_expired : false,
      subscription_status: orgData.subscription_status as 'trial' | 'active' | 'expired' || 'trial',
      trial_start_date: orgData.trial_start_date || null,
      logo_path: orgData.logo_path || null,
      grace_period_end: orgData.grace_period_end || null
    };
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
}

export async function getSubscriptionPlan(planId: string): Promise<SubscriptionPlan | null> {
  try {
    // Mock data for development purposes
    // In a real app you would fetch this from Supabase
    const mockPlans: SubscriptionPlan[] = [
      {
        id: "basic-plan",
        name: "Basic Plan",
        slug: "basic",
        price: 99000,
        max_members: 5,
        features: {
          storage: "5 GB",
          members: "5 members",
          support: "Email support",
          advanced_analytics: false
        },
        is_active: true
      },
      {
        id: "standard-plan",
        name: "Standard Plan",
        slug: "standard",
        price: 299000,
        max_members: 20,
        features: {
          storage: "20 GB",
          members: "20 members",
          support: "Priority support",
          advanced_analytics: true
        },
        is_active: true
      }
    ];
    
    const plan = mockPlans.find(p => p.id === planId);
    return plan || null;
    
  } catch (error) {
    console.error("Error fetching subscription plan:", error);
    return null;
  }
}
