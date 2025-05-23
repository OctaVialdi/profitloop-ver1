
import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import { OrganizationData, UserProfile, SubscriptionPlan, ThemeSettings } from "@/types/organization";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseJsonIfString } from "@/utils/jsonUtils";

export async function fetchOrganizationData(
  setOrganizationData: Dispatch<SetStateAction<OrganizationData>>,
  navigate: NavigateFunction
) {
  try {
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      // Redirect to login if no user
      navigate("/auth/login", { replace: true });
      return;
    }

    // Get the user's profile which includes organization relationship
    const { data: userProfileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      
      // If not found, try to create it
      if (profileError.code === "PGRST116") {
        try {
          // Create a profile for this user
          const { error: createError } = await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            email_verified: user.email_confirmed_at ? true : false,
          });

          if (createError) throw createError;
          
          // Retry the profile fetch
          const { data: newProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
            
          // Set data with the new profile
          setOrganizationData((prev) => ({
            ...prev,
            userProfile: newProfile as UserProfile || null,
            isLoading: false,
          }));
          
          return;
        } catch (err) {
          console.error("Error creating user profile:", err);
          toast.error("Failed to create user profile");
        }
      }
      
      setOrganizationData((prev) => ({
        ...prev,
        error: profileError,
        isLoading: false,
      }));
      return;
    }

    // Check if user has an organization
    if (userProfileData?.organization_id) {
      // Get organization data
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", userProfileData.organization_id)
        .single();

      if (orgError) {
        console.error("Error fetching organization data:", orgError);
        setOrganizationData((prev) => ({
          ...prev,
          error: orgError,
          isLoading: false,
        }));
        return;
      }
      
      // Process theme_settings
      let themeSettings: ThemeSettings = {
        primary_color: "#1E40AF",
        secondary_color: "#3B82F6",
        accent_color: "#60A5FA",
        sidebar_color: "#F1F5F9",
      };
      
      // Handle theme_settings if it exists
      if (orgData.theme_settings) {
        themeSettings = parseJsonIfString<ThemeSettings>(
          orgData.theme_settings, 
          {
            primary_color: "#1E40AF",
            secondary_color: "#3B82F6",
            accent_color: "#60A5FA",
            sidebar_color: "#F1F5F9",
          }
        );
      }
      
      // Ensure subscription_status is a valid enum value
      let subscriptionStatus: 'trial' | 'active' | 'expired' = 'trial';
      if (orgData.subscription_status === 'active' || 
          orgData.subscription_status === 'expired' ||
          orgData.subscription_status === 'trial') {
        subscriptionStatus = orgData.subscription_status;
      }
      
      // Create organization object with processed theme_settings and new fields
      const organization = {
        ...orgData,
        theme_settings: themeSettings,
        subscription_status: subscriptionStatus,
        stripe_customer_id: orgData.stripe_customer_id || null,
        billing_email: orgData.billing_email || null
      };
      
      // Determine user roles based on profile role
      const isSuperAdmin = userProfileData.role === "super_admin";
      const isAdmin = userProfileData.role === "admin" || isSuperAdmin;
      const isEmployee = userProfileData.role === "employee" || isAdmin;
      
      // Calculate trial status
      const trialEndDate = organization.trial_end_date ? new Date(organization.trial_end_date) : null;
      const now = new Date();
      const isTrialActive = !organization.trial_expired && trialEndDate && trialEndDate > now;
      const daysLeftInTrial = (isTrialActive && trialEndDate) ? 
        Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 3600 * 24)) : 0;
      const hasPaidSubscription = organization.subscription_status === 'active';

      // Fetch subscription plan if available
      let subscriptionPlan: SubscriptionPlan | null = null;
      if (organization.subscription_plan_id) {
        const { data: planData, error: planError } = await supabase
          .from("subscription_plans")
          .select("*")
          .eq("id", organization.subscription_plan_id)
          .single();
          
        if (!planError && planData) {
          // Process features if it's a string
          const features = parseJsonIfString<Record<string, any>>(planData.features, {});
          
          subscriptionPlan = {
            ...planData,
            features
          };
        }
      }

      setOrganizationData({
        organization,
        userProfile: userProfileData as UserProfile,
        isLoading: false,
        error: null,
        isSuperAdmin,
        isAdmin, 
        isEmployee,
        isTrialActive,
        daysLeftInTrial,
        hasPaidSubscription,
        subscriptionPlan,
        refreshData: async () => await fetchOrganizationData(setOrganizationData, navigate),
      });
    } else {
      // User doesn't have an org yet
      setOrganizationData({
        organization: null,
        userProfile: userProfileData as UserProfile,
        isLoading: false,
        error: null,
        isSuperAdmin: false,
        isAdmin: false,
        isEmployee: false,
        subscriptionPlan: null,
        refreshData: async () => await fetchOrganizationData(setOrganizationData, navigate),
      });
    }
  } catch (error: any) {
    console.error("Unexpected error in fetchOrganizationData:", error);
    setOrganizationData((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }
}
