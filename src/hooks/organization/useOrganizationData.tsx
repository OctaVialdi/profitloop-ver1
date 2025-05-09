
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { getOrganization, getSubscriptionPlan } from "@/services/organizationService";
import { NavigateFunction } from 'react-router-dom';
import { OrganizationData } from "@/types/organization";

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
        error: "Failed to fetch user profile",
        isLoading: false,
      }));
      return;
    }
    
    if (!profileData || !profileData.organization_id) {
      console.log("User has no organization assigned");
      setOrganizationData(prevState => ({
        ...prevState,
        userProfile: profileData || null,
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
          error: "Organization not found",
          isLoading: false,
          userProfile: profileData,
        }));
        return;
      }
      
      // Get subscription plan if available
      let subscriptionPlan = null;
      if (organizationData.subscription_plan_id) {
        subscriptionPlan = await getSubscriptionPlan(organizationData.subscription_plan_id);
      }
      
      // Calculate trial status
      const now = new Date();
      const trialEnd = organizationData.trial_ends_at ? new Date(organizationData.trial_ends_at) : null;
      const isTrialActive = trialEnd ? now < trialEnd : false;
      
      // Calculate days left in trial
      let daysLeftInTrial = 0;
      if (isTrialActive && trialEnd) {
        const diffTime = Math.abs(trialEnd.getTime() - now.getTime());
        daysLeftInTrial = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      
      // Check if has paid subscription
      const hasPaidSubscription = !!subscriptionPlan && 
                                subscriptionPlan.price > 0 && 
                                !organizationData.trial_expired;
                                
      // Check user role within organization
      const isSuperAdmin = profileData.role === 'super_admin';
      const isAdmin = profileData.role === 'admin' || isSuperAdmin;
      const isEmployee = profileData.role === 'employee' || isAdmin;
      
      // Update state with all the data
      setOrganizationData(prevState => ({
        ...prevState,
        organization: organizationData,
        subscriptionPlan,
        userProfile: profileData,
        isLoading: false,
        error: null,
        isSuperAdmin,
        isAdmin,
        isEmployee,
        isTrialActive,
        daysLeftInTrial,
        hasPaidSubscription
      }));
      
    } catch (error: any) {
      console.error("Error fetching organization:", error);
      toast.error("Failed to load organization data");
      
      setOrganizationData(prevState => ({
        ...prevState,
        error: error.message || "Failed to load organization data",
        isLoading: false,
        userProfile: profileData
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
      error: error.message || "An unexpected error occurred",
      isLoading: false
    }));
  }
}
