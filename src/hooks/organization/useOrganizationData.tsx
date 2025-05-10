
import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import { OrganizationData } from "@/types/organization";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    const { data: userProfile, error: profileError } = await supabase
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
            userProfile: newProfile || null,
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
    if (userProfile?.organization_id) {
      // Get organization data
      const { data: organization, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", userProfile.organization_id)
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
      
      // Determine user roles based on profile role
      const isSuperAdmin = userProfile.role === "super_admin";
      const isAdmin = userProfile.role === "admin" || isSuperAdmin;
      const isEmployee = userProfile.role === "employee" || isAdmin;

      setOrganizationData({
        organization,
        userProfile,
        isLoading: false,
        error: null,
        isSuperAdmin,
        isAdmin, 
        isEmployee,
        refreshData: async () => await fetchOrganizationData(setOrganizationData, navigate),
      });
    } else {
      // User doesn't have an org yet
      setOrganizationData({
        organization: null,
        userProfile,
        isLoading: false,
        error: null,
        isSuperAdmin: false,
        isAdmin: false,
        isEmployee: false,
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
