
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { getOrganization, getSubscriptionPlan } from "@/services/organizationService";
import { NavigateFunction } from 'react-router-dom';
import { OrganizationData } from "@/types/organization";
import { calculateTrialStatus, calculateSubscriptionStatus, calculateUserRoles } from "@/utils/organizationUtils";

// Helper function to convert profile data to the expected UserProfile type
function transformUserProfile(profileData: any) {
  if (!profileData) return null;
  
  // Ensure preferences is properly transformed from Json to UserPreferences
  const preferences = typeof profileData.preferences === 'string' 
    ? JSON.parse(profileData.preferences) 
    : profileData.preferences || {};
    
  return {
    ...profileData,
    preferences
  };
}

export async function fetchOrganizationData(
  setOrganizationData: React.Dispatch<React.SetStateAction<OrganizationData>>,
  navigate?: NavigateFunction
) {
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.log("No active session found");
      setOrganizationData(prevState => ({
        ...prevState,
        isLoading: false,
      }));
      return;
    }
    
    const userId = sessionData.session.user.id;
    
    // Get user profile data including organization_id
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      setOrganizationData(prevState => ({
        ...prevState,
        error: new Error("Failed to fetch user profile"),
        isLoading: false,
      }));
      return;
    }
    
    if (!profileData || !profileData.organization_id) {
      console.log("User has no organization assigned");
      setOrganizationData(prevState => ({
        ...prevState,
        userProfile: transformUserProfile(profileData),
        isLoading: false,
      }));
      return;
    }
    
    // Get organization data
    try {
      const organizationData = await getOrganization(profileData.organization_id);
      
      if (!organizationData) {
        console.error("Organization not found");
        setOrganizationData(prevState => ({
          ...prevState,
          error: new Error("Organization not found"),
          isLoading: false,
          userProfile: transformUserProfile(profileData),
        }));
        return;
      }
      
      // Get subscription plan if available
      let subscriptionPlan = null;
      if (organizationData.subscription_plan_id) {
        subscriptionPlan = await getSubscriptionPlan(organizationData.subscription_plan_id);
      }
      
      // Calculate trial status using utility function
      const trialStatus = calculateTrialStatus(organizationData);
      const isTrialActive = trialStatus.isTrialActive;
      const daysLeftInTrial = trialStatus.daysLeftInTrial;
      
      // Calculate subscription status using utility function
      const hasPaidSubscription = calculateSubscriptionStatus(organizationData, subscriptionPlan);
      
      // Calculate user roles using utility function
      const userRoles = calculateUserRoles(transformUserProfile(profileData));
      
      // Update state with all the data
      setOrganizationData(prevState => ({
        ...prevState,
        organization: organizationData,
        subscriptionPlan,
        userProfile: transformUserProfile(profileData),
        isLoading: false,
        error: null,
        isSuperAdmin: userRoles.isSuperAdmin,
        isAdmin: userRoles.isAdmin,
        isEmployee: userRoles.isEmployee,
        isTrialActive,
        daysLeftInTrial,
        hasPaidSubscription
      }));
      
    } catch (error: any) {
      console.error("Error fetching organization:", error);
      toast.error("Failed to load organization data");
      
      setOrganizationData(prevState => ({
        ...prevState,
        error: new Error(error.message || "Failed to load organization data"),
        isLoading: false,
        userProfile: transformUserProfile(profileData)
      }));
    }
    
  } catch (error: any) {
    console.error("Error in organization data fetch:", error);
    
    if (error.message?.includes('JWT expired')) {
      toast.error("Your session has expired. Please login again.");
      if (navigate) navigate("/auth/login");
    }
    
    setOrganizationData(prevState => ({
      ...prevState,
      error: new Error(error.message || "An unexpected error occurred"),
      isLoading: false
    }));
  }
}
