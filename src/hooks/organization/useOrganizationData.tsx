
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getOrganization, getSubscriptionPlan, checkTrialExpiration } from "@/services/organizationService";
import { getUserProfile } from "@/services/profileService";
import { calculateTrialStatus, calculateSubscriptionStatus, calculateUserRoles } from "@/utils/organizationUtils";
import { formatTimestampToUserTimezone } from "@/utils/dateUtils";
import { OrganizationData } from "@/types/organization";

export async function fetchOrganizationData(
  setOrganizationData: React.Dispatch<React.SetStateAction<OrganizationData>>,
  navigate: (path: string) => void
): Promise<void> {
  setOrganizationData(current => ({ ...current, isLoading: true, error: null }));
  
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("No session found, redirecting to login");
      navigate('/auth/login');
      return;
    }
    
    // Get user profile
    const profile = await getUserProfile(session.user.id);
    
    if (!profile) {
      console.log("No profile found, redirecting to onboarding");
      navigate('/organizations');
      return;
    }
    
    // Check if the organization ID in the session metadata is different from the one in the profile
    // This can happen after switching organizations
    const orgIdInMetadata = session.user.user_metadata?.organization_id;
    
    if (orgIdInMetadata && profile.organization_id !== orgIdInMetadata) {
      // The user has switched organizations, get the profile for the new organization
      console.log("Organization changed in metadata, updating profile data");
      const { data: profileWithOrgId } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .eq('organization_id', orgIdInMetadata)
        .single();
        
      if (profileWithOrgId) {
        // Use this profile instead
        profile.organization_id = profileWithOrgId.organization_id;
        
        // Validate role type before assignment
        const role = profileWithOrgId.role;
        if (role === 'super_admin' || role === 'admin' || role === 'employee') {
          profile.role = role;
        } else {
          // Default to 'employee' if role is not valid
          profile.role = 'employee';
        }
      } else {
        // Metadata points to an organization that doesn't exist in the profile
        // Update user metadata to match the profile's organization
        await updateUserOrgMetadata(
          profile.organization_id || '', 
          profile.role || 'employee'
        );
      }
    }
    
    if (!profile.organization_id) {
      // Check if this user might have created an organization previously
      const userEmail = session.user.email?.toLowerCase();
      if (userEmail) {
        const { data: createdOrg } = await supabase
          .from('organizations')
          .select('id')
          .eq('creator_email', userEmail)
          .maybeSingle();
          
        if (createdOrg) {
          console.log("Found organization created by this email:", createdOrg.id);
          
          // Update the profile with the found organization
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              organization_id: createdOrg.id,
              role: 'super_admin'  // Creator gets super_admin role
            })
            .eq('id', session.user.id);
            
          if (updateError) {
            console.error("Error linking profile to organization:", updateError);
          } else {
            profile.organization_id = createdOrg.id;
            profile.role = 'super_admin';
            console.log("Profile updated with existing organization");
            
            // Update metadata too
            await updateUserOrgMetadata(createdOrg.id, 'super_admin');
          }
        }
      }
      
      // If still no organization after checking, redirect to onboarding
      if (!profile.organization_id) {
        console.log("No organization associated with profile, redirecting to onboarding");
        navigate('/organizations');
        return;
      }
    }

    // If organization_id exists but not in user metadata, update it
    if (profile.organization_id && 
        (!session.user.user_metadata?.organization_id || 
         session.user.user_metadata.organization_id !== profile.organization_id)) {
      console.log("Updating user metadata with organization ID:", profile.organization_id);
      await updateUserOrgMetadata(
        profile.organization_id, 
        profile.role || 'employee'
      );
    }
    
    // Get organization data
    const organization = await getOrganization(profile.organization_id);
    
    if (!organization) {
      console.error("Organization not found even though profile has organization_id");
      throw new Error("Organisasi tidak ditemukan");
    }
    
    // Format timestamps according to user's timezone
    if (profile.created_at) {
      // Use the user's timezone preference or default to Asia/Jakarta
      const userTimezone = profile.timezone || 'Asia/Jakarta';
      
      // Format the created_at timestamp with the user's timezone
      profile.created_at_formatted = formatTimestampToUserTimezone(
        profile.created_at,
        userTimezone,
        'EEE dd MMM yyyy HH:mm:ss'
      );
    }
    
    // Get subscription plan data if available
    let subscriptionPlan = null;
    if (organization.subscription_plan_id) {
      subscriptionPlan = await getSubscriptionPlan(organization.subscription_plan_id);
    }
    
    // Calculate derived state
    const { isTrialActive, daysLeftInTrial } = calculateTrialStatus(organization);
    const hasPaidSubscription = calculateSubscriptionStatus(organization, subscriptionPlan);
    const { isSuperAdmin, isAdmin, isEmployee } = calculateUserRoles(profile);
    
    // Check if trial has expired but not marked as expired
    if (organization.trial_end_date && 
        new Date(organization.trial_end_date) < new Date() && 
        !organization.trial_expired) {
      // Trigger the edge function to check trial expiration
      checkTrialExpiration();
    }
    
    setOrganizationData({
      organization,
      subscriptionPlan,
      userProfile: profile,
      isLoading: false,
      error: null,
      isSuperAdmin,
      isAdmin,
      isEmployee,
      isTrialActive,
      daysLeftInTrial,
      hasPaidSubscription,
      refreshData: () => fetchOrganizationData(setOrganizationData, navigate)
    });
  } catch (err: any) {
    console.error("Error fetching organization data:", err);
    setOrganizationData(current => ({
      ...current,
      isLoading: false,
      error: err as Error
    }));
    toast.error("Gagal memuat data organisasi");
  }
}

// Helper function moved from supabase client for direct access
async function updateUserOrgMetadata(organizationId: string, role: string) {
  try {
    // Update user metadata with organization_id and role
    const { error } = await supabase.auth.updateUser({
      data: { 
        organization_id: organizationId,
        role: role
      }
    });
    
    if (error) {
      console.error("Error updating user metadata:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception updating user metadata:", err);
    return false;
  }
}
