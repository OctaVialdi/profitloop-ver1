import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import { OrganizationData, UserProfile } from "@/types/organization";
import { supabase } from "@/integrations/supabase/client";
import { getOrganization, getSubscriptionPlan } from "@/services/organizationService";
import { calculateTrialStatus, calculateSubscriptionStatus, calculateUserRoles } from "@/utils/organizationUtils";

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
    
    // Get user profile to find organization
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*, organizations:organization_id (*)')
      .eq('id', user.id)
      .maybeSingle();
      
    // If user doesn't have an organization, redirect to organization setup
    if (!userProfile?.organization_id) {
      // Check if user has seen welcome page
      const hasSeenWelcome = userProfile?.has_seen_welcome || false;
      
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
    
    // Get organization and subscription plan details
    try {
      const organization = await getOrganization(userProfile.organization_id);
      let subscriptionPlan = null;
      
      if (organization?.subscription_plan_id) {
        subscriptionPlan = await getSubscriptionPlan(organization.subscription_plan_id);
      }
      
      // Calculate status values
      const { isTrialActive, daysLeftInTrial } = calculateTrialStatus(organization);
      const hasPaidSubscription = calculateSubscriptionStatus(organization, subscriptionPlan);
      const { isSuperAdmin, isAdmin, isEmployee } = calculateUserRoles(userProfile);
      
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
