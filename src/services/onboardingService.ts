
import { supabase } from "@/integrations/supabase/client";
import { Organization, SubscriptionPlan, UserProfile } from "@/types/organization";
import { OrganizationFormData } from "@/types/onboarding";

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

export async function createOrganization(formData: OrganizationFormData) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No authenticated user found");
      return false;
    }
    
    // Fetch the user's actual creation timestamp from auth.users
    // Using the admin API we can't directly access auth.users, so we'll use a custom approach
    // Get the user's metadata which includes created_at
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error fetching user data:", userError);
      return false;
    }
    
    // Get business field options
    const employeeCount = parseInt(formData.employeeCount) || 0;
    
    // Call the function to create organization with profile
    // We need to use 'create_organization_with_profile' as that's what's in the TypeScript types
    const { data: orgData, error } = await supabase.rpc(
      'create_organization_with_profile',
      {
        user_id: session.user.id,
        org_name: formData.name.trim(),
        org_business_field: formData.businessField || null,
        org_employee_count: employeeCount,
        org_address: formData.address || null,
        org_phone: formData.phone || null,
        user_role: 'super_admin'
      }
    );
    
    if (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
    
    if (orgData) {
      console.log("Organization created successfully:", orgData);
      
      // We need to properly handle the return type from the RPC function
      // The result is a JSON object, so we need to cast it properly
      const organizationData = orgData as { id: string };
      
      // Set a trial_end_date to 1 minute from now for testing
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          trial_end_date: new Date(Date.now() + 60 * 1000).toISOString() // 1 minute from now
        })
        .eq('id', organizationData.id);
        
      if (updateError) {
        console.error("Error updating trial end date:", updateError);
      }
      
      // Update user metadata with organization ID
      await supabase.auth.updateUser({
        data: {
          organization_id: organizationData.id,
          role: 'super_admin'
        }
      });
      
      return orgData;
    }
    
    return false;
  } catch (error) {
    console.error("Error in createOrganization:", error);
    throw error;
  }
}
