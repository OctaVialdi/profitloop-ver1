
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../auth/useAuth";
import { Organization, UserProfile } from "@/types/organization";

export interface OrganizationData {
  organization: Organization | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

export function useOrganizationData(): OrganizationData {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();
  
  // Calculate roles
  const isSuperAdmin = userProfile?.role === 'super_admin';
  const isAdmin = userProfile?.role === 'admin' || isSuperAdmin;
  
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
      
      setUserProfile(profileData);
      
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
    isAdmin
  };
}
