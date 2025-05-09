
import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import { OrganizationData, UserProfile, UserPreferences } from "@/types/organization";
import { supabase } from "@/integrations/supabase/client";
import { getOrganization, getSubscriptionPlan } from "@/services/organizationService";
import { calculateTrialStatus, calculateSubscriptionStatus, calculateUserRoles } from "@/utils/organizationUtils";

// Helper function to safely parse preferences
const parseUserPreferences = (rawPreferences: any): UserPreferences => {
  if (!rawPreferences) {
    return { dark_mode: false };
  }
  
  // If it's already an object, return it
  if (typeof rawPreferences === 'object' && rawPreferences !== null) {
    return rawPreferences as UserPreferences;
  }
  
  // If it's a JSON string, try to parse it
  if (typeof rawPreferences === 'string') {
    try {
      return JSON.parse(rawPreferences) as UserPreferences;
    } catch (e) {
      console.error("Error parsing preferences:", e);
    }
  }
  
  // Default preferences if parsing fails
  return { dark_mode: false };
};

export async function fetchOrganizationData(
  setOrganizationData: Dispatch<SetStateAction<OrganizationData>>,
  navigate: NavigateFunction
) {
  try {
    setOrganizationData(prevState => ({ ...prevState, isLoading: true, error: null }));

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // If no user is found, redirect to login
      setOrganizationData(prevState => ({ ...prevState, isLoading: false }));
      navigate('/auth/login');
      return;
    }
    
    console.log("fetchOrganizationData - User found:", user.id);
    
    // Get user profile to find organization
    const { data: userProfileData } = await supabase
      .from('profiles')
      .select('*, organizations:organization_id (*)')
      .eq('id', user.id)
      .maybeSingle();
      
    // If user doesn't have an organization, redirect to organization setup
    if (!userProfileData?.organization_id) {
      // Check if user has seen welcome page
      const hasSeenWelcome = userProfileData?.has_seen_welcome || false;
      
      if (!hasSeenWelcome) {
        // If user hasn't seen welcome, redirect to employee welcome
        navigate('/employee-welcome');
        setOrganizationData(prevState => ({ ...prevState, isLoading: false }));
      } else {
        // Otherwise redirect to organization setup
        navigate('/organizations');
        setOrganizationData(prevState => ({ ...prevState, isLoading: false }));
      }
      return;
    }
    
    console.log("fetchOrganizationData - User profile data:", userProfileData);
    
    // Transform the raw profile data to ensure it matches the UserProfile type
    const userProfile: UserProfile = {
      ...userProfileData,
      preferences: parseUserPreferences(userProfileData.preferences)
    };
    
    // Get organization and subscription plan details
    try {
      const organization = await getOrganization(userProfile.organization_id);
      let subscriptionPlan = null;
      
      if (organization?.subscription_plan_id) {
        subscriptionPlan = await getSubscriptionPlan(organization.subscription_plan_id);
      }
      
      console.log("fetchOrganizationData - Organization fetched:", organization);
      console.log("fetchOrganizationData - Subscription plan:", subscriptionPlan);
      
      // Calculate status values
      const { isTrialActive, daysLeftInTrial } = calculateTrialStatus(organization);
      const hasPaidSubscription = calculateSubscriptionStatus(organization, subscriptionPlan);
      const { isSuperAdmin, isAdmin, isEmployee } = calculateUserRoles(userProfile);
      
      console.log("fetchOrganizationData - Trial status calculated:", { isTrialActive, daysLeftInTrial });
      console.log("fetchOrganizationData - Has paid subscription:", hasPaidSubscription);
      
      // Update organization data
      setOrganizationData({
        organization,
        subscriptionPlan,
        userProfile,
        isLoading: false,
        error: null,
        isSuperAdmin,
        isAdmin,
        isEmployee,
        isTrialActive,
        daysLeftInTrial,
        hasPaidSubscription,
        refreshData: async () => await fetchOrganizationData(setOrganizationData, navigate)
      });
    } catch (error: any) {
      console.error("Error fetching organization data:", error);
      setOrganizationData(prevState => ({
        ...prevState,
        isLoading: false,
        error: error as Error
      }));
    }
  } catch (error: any) {
    console.error("Error in organization data fetch:", error);
    setOrganizationData(prevState => ({
      ...prevState,
      isLoading: false,
      error: error as Error
    }));
  }
}
