
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
    
    // Cast to Organization type with proper defaults for new fields
    const organization: Organization = {
      ...orgData as any,
      // Ensure the required fields from our type exist
      subscription_status: orgData.subscription_status || 'trial',
      trial_start_date: orgData.trial_start_date || null,
      trial_end_date: orgData.trial_end_date || null,
      grace_period_end: orgData.grace_period_end || null,
      trial_expired: orgData.trial_expired !== null ? orgData.trial_expired : false
    };
    
    return organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
}

export async function getSubscriptionPlan(planId: string): Promise<SubscriptionPlan | null> {
  try {
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .maybeSingle();
        
    if (planError || !planData) {
      return null;
    }
    
    return planData as SubscriptionPlan;
  } catch (error) {
    console.error("Error fetching subscription plan:", error);
    return null;
  }
}
