
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
    
    // Ensure theme_settings matches our interface structure
    let themeSettings = orgData.theme_settings || {
      primary_color: "#1E40AF",
      secondary_color: "#3B82F6",
      accent_color: "#60A5FA",
      sidebar_color: "#F1F5F9",
    };
    
    // Convert from JSON string if needed
    if (typeof themeSettings === 'string') {
      try {
        themeSettings = JSON.parse(themeSettings);
      } catch (e) {
        console.warn('Could not parse theme_settings JSON:', e);
        themeSettings = {
          primary_color: "#1E40AF",
          secondary_color: "#3B82F6",
          accent_color: "#60A5FA",
          sidebar_color: "#F1F5F9",
        };
      }
    }
    
    return {
      ...orgData as unknown as Organization,
      theme_settings: themeSettings,
      trial_expired: orgData.trial_expired !== null ? orgData.trial_expired : false,
      subscription_status: orgData.subscription_status as 'trial' | 'active' | 'expired' || 'trial',
      trial_start_date: orgData.trial_start_date || null,
      grace_period_end: orgData.grace_period_end || null,
      stripe_customer_id: orgData.stripe_customer_id || null, // Added new field
      billing_email: orgData.billing_email || null // Added new field
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
    
    // Parse features from JSON if needed
    let features = planData.features;
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        console.warn('Could not parse features JSON:', e);
        features = null;
      }
    }
    
    return {
      ...planData,
      features
    } as SubscriptionPlan;
  } catch (error) {
    console.error("Error fetching subscription plan:", error);
    return null;
  }
}
