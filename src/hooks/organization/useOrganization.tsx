
import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../auth/useAuth";
import { Organization, OrganizationData, SubscriptionPlan, UserProfile, UserPreferences } from "@/types/organization";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useTrialStatus } from "../useTrialStatus";

// Context for organization data
const OrganizationContext = createContext<OrganizationData>({
  organization: null,
  userProfile: null,
  isLoading: true,
  error: null,
  isSuperAdmin: false,
  isAdmin: false,
  isEmployee: false,
  refreshData: async () => {},
  isTrialActive: false,
  daysLeftInTrial: 0,
  hasPaidSubscription: false,
  subscriptionPlan: null
});

// Provider component
export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Calculate user roles
  const isSuperAdmin = userProfile?.role === 'super_admin';
  const isAdmin = userProfile?.role === 'admin' || isSuperAdmin;
  const isEmployee = !!userProfile?.role;
  
  // Get trial and subscription status
  const { isTrialActive, daysLeftInTrial, isTrialExpired, hasPaidSubscription } = useTrialStatus(organization);
  
  // Load organization data
  const loadOrganizationData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user profile with organization_id
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
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

      // Check if this user is part of an organization
      if (!profileData.organization_id) {
        setIsLoading(false);
        return;
      }

      // Fetch organization details
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", profileData.organization_id)
        .single();

      if (orgError) {
        throw new Error(`Failed to load organization: ${orgError.message}`);
      }

      // Add the logo_path property if it doesn't exist
      const orgWithLogoPath: Organization = {
        ...orgData,
        logo_path: orgData.logo_path || null
      };

      setOrganization(orgWithLogoPath);

      // Fetch subscription plan if available
      if (orgData.subscription_plan_id) {
        try {
          // For this example, we'll use a mock plan
          const mockPlan: SubscriptionPlan = {
            id: "standard-plan",
            name: "Standard",
            slug: "standard",
            price: 299000,
            max_members: 20,
            features: {
              storage: "10GB",
              members: "20 members",
              support: "Priority support",
              advanced_analytics: true
            },
            is_active: true
          };
          
          setSubscriptionPlan(mockPlan);
        } catch (subscriptionError) {
          console.error("Error fetching subscription plan:", subscriptionError);
        }
      }
    } catch (err: any) {
      console.error("Error loading organization data:", err);
      setError(err);
      toast.error("Error loading organization data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh data
  const refreshData = async () => {
    await loadOrganizationData();
  };

  // Load organization data on mount or when user changes
  useEffect(() => {
    loadOrganizationData();
  }, [user?.id]);

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        userProfile,
        isLoading,
        error,
        isSuperAdmin,
        isAdmin,
        isEmployee,
        refreshData,
        isTrialActive,
        daysLeftInTrial,
        hasPaidSubscription,
        subscriptionPlan
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

// Hook to use organization data
export const useOrganization = () => useContext(OrganizationContext);
