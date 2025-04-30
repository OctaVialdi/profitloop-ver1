
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Organization {
  id: string;
  name: string;
  business_field: string | null;
  employee_count: number | null;
  address: string | null;
  phone: string | null;
  subscription_plan_id: string | null;
  trial_end_date: string | null;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  organization_id: string | null;
  role: 'super_admin' | 'admin' | 'employee' | null;
  invited_by: string | null;
}

interface OrganizationData {
  organization: Organization | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isTrialActive: boolean;
  daysLeftInTrial: number;
  refreshData: () => Promise<void>;
}

export function useOrganization(): OrganizationData {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const isSuperAdmin = userProfile?.role === 'super_admin';
  const isAdmin = userProfile?.role === 'admin' || isSuperAdmin;
  const isEmployee = !!userProfile?.role;
  
  const isTrialActive = !!organization?.trial_end_date && new Date(organization.trial_end_date) > new Date();
  const daysLeftInTrial = organization?.trial_end_date 
    ? Math.max(0, Math.ceil((new Date(organization.trial_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const fetchOrganizationData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth/login');
        return;
      }
      
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        throw profileError;
      }
      
      if (!profileData.organization_id) {
        navigate('/onboarding');
        return;
      }
      
      setUserProfile(profileData as UserProfile);
      
      // Get organization data
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profileData.organization_id)
        .single();
      
      if (orgError) {
        throw orgError;
      }
      
      setOrganization(orgData as Organization);
    } catch (err: any) {
      console.error("Error fetching organization data:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  return {
    organization,
    userProfile,
    isLoading,
    error,
    isSuperAdmin,
    isAdmin,
    isEmployee,
    isTrialActive,
    daysLeftInTrial,
    refreshData: fetchOrganizationData
  };
}
