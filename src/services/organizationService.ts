
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
    
    // Ensure trial_expired exists (default to false if not present)
    return {
      ...orgData as Organization,
      trial_expired: orgData.trial_expired !== null ? orgData.trial_expired : false
    };
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

export async function checkTrialExpiration(): Promise<void> {
  try {
    await supabase.functions.invoke('check-trial-expiration');
  } catch (err) {
    console.error("Failed to invoke check-trial-expiration:", err);
  }
}
