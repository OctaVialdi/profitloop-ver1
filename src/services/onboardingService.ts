
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

export async function createOrganization(formData: OrganizationFormData & { creator_email?: string }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No authenticated user found");
      return false;
    }
    
    // Get business field options
    const employeeCount = parseInt(formData.employeeCount) || 0;
    
    // Call the function to create organization with profile
    // Make sure the parameter names match exactly with what's defined in the SQL function
    const { data: orgData, error } = await supabase.rpc(
      'create_organization_with_profile',
      {
        user_id: session.user.id,
        org_name: formData.name.trim(),
        org_business_field: formData.businessField || null,
        org_employee_count: employeeCount,
        org_address: formData.address || null,
        org_phone: formData.phone || null,
        user_role: 'super_admin',
        creator_email: formData.creator_email || session.user.email?.toLowerCase() || null
      }
    );
    
    if (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
    
    if (orgData) {
      console.log("Organization created successfully:", orgData);
      
      // The result is a JSON object, so we need to cast it properly
      const organizationData = orgData as { id: string };
      
      // Set a trial_end_date to 30 days from now (instead of just 1 minute)
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        })
        .eq('id', organizationData.id);
        
      if (updateError) {
        console.error("Error updating trial end date:", updateError);
      }
      
      // Update user metadata with organization ID
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          organization_id: organizationData.id,
          role: 'super_admin'
        }
      });
      
      if (metadataError) {
        console.error("Error updating user metadata:", metadataError);
      }
      
      // Double check that the profile has been updated with organization_id
      // If not, update it directly as a fallback mechanism
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .single();
      
      if (!profileData?.organization_id) {
        console.log("Profile not updated with organization_id, applying direct update");
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            organization_id: organizationData.id,
            role: 'super_admin'
          })
          .eq('id', session.user.id);
          
        if (profileError) {
          console.error("Error updating profile with organization_id:", profileError);
        }
      }
      
      return orgData;
    }
    
    return false;
  } catch (error) {
    console.error("Error in createOrganization:", error);
    throw error;
  }
}
