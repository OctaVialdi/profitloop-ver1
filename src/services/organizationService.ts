
import { supabase } from "@/integrations/supabase/client";
import { Organization, SubscriptionPlan, UserProfile } from "@/types/organization";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Get user profile using direct query by ID
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_user_profile_by_id', {
        user_id: userId
      })
      .maybeSingle();
    
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      throw profileError;
    }
    
    if (!profileData) {
      return null;
    }
    
    // Get full profile data to have complete information
    const { data: fullProfileData, error: fullProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (fullProfileError) {
      console.error("Full profile fetch error:", fullProfileError);
      // Don't throw, continue with limited profile data
    }
    
    // Use full profile if available, otherwise use limited data
    return {
      ...profileData,
      ...(fullProfileData || {})
    } as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

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
