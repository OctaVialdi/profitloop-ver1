
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface Organization {
  id: string;
  name: string;
  business_field: string | null;
  employee_count: number | null;
  address: string | null;
  phone: string | null;
  subscription_plan_id: string | null;
  trial_end_date: string | null;
  trial_expired: boolean | null;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  max_members: number | null;
  price: number | null;
  features: Record<string, any> | null;
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
  subscriptionPlan: SubscriptionPlan | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isTrialActive: boolean;
  daysLeftInTrial: number;
  hasPaidSubscription: boolean;
  refreshData: () => Promise<void>;
}

export function useOrganization(): OrganizationData {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const isSuperAdmin = userProfile?.role === 'super_admin';
  const isAdmin = userProfile?.role === 'admin' || isSuperAdmin;
  const isEmployee = !!userProfile?.role;
  
  const isTrialActive = !!organization?.trial_end_date && 
                        new Date(organization.trial_end_date) > new Date() && 
                        !organization.trial_expired;
                        
  const daysLeftInTrial = organization?.trial_end_date 
    ? Math.max(0, Math.ceil((new Date(organization.trial_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
    
  const hasPaidSubscription = !!subscriptionPlan && 
                              subscriptionPlan.name !== 'Basic' && 
                              !!organization?.subscription_plan_id;

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
      
      // Properly handle the trial_expired field by ensuring it's included
      // If it's not in the response (old data), set a default value
      const orgWithTrialStatus: Organization = {
        ...orgData,
        trial_expired: orgData.trial_expired !== undefined ? orgData.trial_expired : false
      };
      
      setOrganization(orgWithTrialStatus);
      
      // Get subscription plan data if available
      if (orgData.subscription_plan_id) {
        const { data: planData, error: planError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', orgData.subscription_plan_id)
          .single();
          
        if (!planError && planData) {
          setSubscriptionPlan(planData as SubscriptionPlan);
        }
      }
      
      // Check if trial has expired but not marked as expired
      if (orgData.trial_end_date && 
          new Date(orgData.trial_end_date) < new Date() && 
          !orgData.trial_expired) {
        // Trigger the edge function to check trial expiration
        try {
          await supabase.functions.invoke('check-trial-expiration');
        } catch (err) {
          console.error("Failed to invoke check-trial-expiration:", err);
        }
      }
    } catch (err: any) {
      console.error("Error fetching organization data:", err);
      setError(err);
      toast.error("Gagal memuat data organisasi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
    
    // Set up listener for subscription changes
    const channel = supabase
      .channel('org-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'organizations',
          filter: userProfile?.organization_id ? `id=eq.${userProfile.organization_id}` : undefined
        }, 
        () => {
          fetchOrganizationData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile?.organization_id]);

  return {
    organization,
    subscriptionPlan,
    userProfile,
    isLoading,
    error,
    isSuperAdmin,
    isAdmin,
    isEmployee,
    isTrialActive,
    daysLeftInTrial,
    hasPaidSubscription,
    refreshData: fetchOrganizationData
  };
}
