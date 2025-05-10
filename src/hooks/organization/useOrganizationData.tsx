
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../auth/useAuth";
import { Organization, UserProfile, SubscriptionPlan, UserPreferences } from "@/types/organization";
import { calculateTrialStatus, calculateSubscriptionStatus } from "@/utils/organizationUtils";

export interface OrganizationData {
  organization: Organization | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isTrialActive: boolean;
  daysLeftInTrial: number;
  hasPaidSubscription: boolean;
  subscriptionPlan: SubscriptionPlan | null;
}

export function useOrganizationData(): OrganizationData {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  const [daysLeftInTrial, setDaysLeftInTrial] = useState<number>(0);
  const [hasPaidSubscription, setHasPaidSubscription] = useState<boolean>(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Calculate roles
  const isSuperAdmin = userProfile?.role === 'super_admin';
  const isAdmin = userProfile?.role === 'admin' || isSuperAdmin;
  const isEmployee = userProfile?.role === 'employee' || isAdmin;
  
  const loadOrganizationData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        throw new Error(`Failed to load user profile: ${profileError.message}`);
      }
      
      // Convert JSON preferences to UserPreferences object
      const preferences: UserPreferences = 
        (typeof profileData.preferences === 'string' && profileData.preferences) 
          ? JSON.parse(profileData.preferences) 
          : profileData.preferences || {};
      
      // Create UserProfile with proper preferences type
      const userProfileWithTypes: UserProfile = {
        ...profileData,
        preferences
      };
      
      setUserProfile(userProfileWithTypes);
      
      // Check if user has organization
      if (!profileData.organization_id) {
        setIsLoading(false);
        return;
      }
      
      // Fetch organization data
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profileData.organization_id)
        .single();
      
      if (orgError) {
        throw new Error(`Failed to load organization: ${orgError.message}`);
      }

      // Ensure organization has all required properties including logo_path
      const completeOrgData: Organization = {
        ...orgData,
        logo_path: orgData.logo_path || null
      };
      
      setOrganization(completeOrgData);
      
      // Calculate trial status
      if (completeOrgData) {
        const { isTrialActive, daysLeftInTrial } = calculateTrialStatus(completeOrgData);
        setIsTrialActive(isTrialActive);
        setDaysLeftInTrial(daysLeftInTrial);
        
        // Mock subscription plan for demo purposes
        const mockSubscriptionPlan: SubscriptionPlan = {
          id: "basic-plan",
          name: "Basic Plan",
          slug: "basic",
          price: 9900,
          max_members: 5,
          features: {
            storage: "5 GB",
            members: "5 members",
            support: "Email support",
            advanced_analytics: false
          },
          is_active: true
        };
        
        setSubscriptionPlan(mockSubscriptionPlan);
        
        // Calculate subscription status
        const hasPaidSub = calculateSubscriptionStatus(completeOrgData, mockSubscriptionPlan);
        setHasPaidSubscription(hasPaidSub);
      }
      
    } catch (err: any) {
      console.error('Error loading organization data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshData = async () => {
    await loadOrganizationData();
  };
  
  useEffect(() => {
    loadOrganizationData();
  }, [user?.id]);
  
  return {
    organization,
    userProfile,
    isLoading,
    error,
    refreshData,
    isSuperAdmin,
    isAdmin,
    isEmployee,
    isTrialActive,
    daysLeftInTrial,
    hasPaidSubscription,
    subscriptionPlan
  };
}

export const fetchOrganizationData = async (
  setOrganizationData: React.Dispatch<React.SetStateAction<any>>, 
  navigate: ReturnType<typeof useNavigate>
) => {
  // This function is here for backward compatibility
  // The actual implementation is now in useOrganizationData
  console.log("fetchOrganizationData is deprecated, use useOrganizationData hook instead");
};
