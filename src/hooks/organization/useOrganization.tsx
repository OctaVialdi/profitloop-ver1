
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Organization, OrganizationData, UserProfile } from "@/types/organization";
import { useAuthState } from "@/hooks/useAuthState";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { subscriptionService } from "@/services/subscriptionService";

export const useOrganization = (): { 
  organizationData: OrganizationData,
  loading: boolean 
} => {
  const { user } = useAuthState();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  
  // Get the organization ID from user metadata or profile
  useEffect(() => {
    const fetchOrgId = async () => {
      if (!user) return;
      
      // Try to get from user metadata first (faster)
      const orgId = user.user_metadata?.organization_id;
      
      if (orgId) {
        setOrganizationId(orgId);
        return;
      }
      
      // Fallback to profile query
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .maybeSingle();
          
        if (profile?.organization_id) {
          setOrganizationId(profile.organization_id);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    
    fetchOrgId();
  }, [user]);

  // Get organization data
  const { 
    data: organization, 
    isLoading: orgLoading, 
    error: orgError,
    refetch: refetchOrg
  } = useQuery({
    queryKey: ['organization', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      
      const { data } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .maybeSingle();
        
      return data as Organization;
    },
    enabled: !!organizationId
  });

  // Get user profile data
  const { 
    data: userProfile, 
    isLoading: profileLoading
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      return data as UserProfile;
    },
    enabled: !!user?.id
  });

  // Get trial status
  const { 
    daysLeftInTrial, 
    isTrialActive, 
    hasPaidSubscription 
  } = useTrialStatus(organization || null);

  // Get current subscription plan
  const { 
    data: subscriptionPlan,
    isLoading: planLoading
  } = useQuery({
    queryKey: ['subscriptionPlan', organization?.subscription_plan_id],
    queryFn: async () => {
      if (!organization?.id || !organization?.subscription_plan_id) return null;
      return subscriptionService.getCurrentPlan(organization.id);
    },
    enabled: !!organization?.subscription_plan_id
  });

  // Role-based permissions
  const isSuperAdmin = userProfile?.role === 'super_admin';
  const isAdmin = userProfile?.role === 'admin' || isSuperAdmin;
  const isEmployee = !!userProfile;

  // Refresh data function
  const refreshData = async () => {
    await refetchOrg();
  };

  // Combine all data into one object
  const organizationData: OrganizationData = {
    organization,
    userProfile,
    isLoading: orgLoading || profileLoading || planLoading,
    error: orgError as Error,
    isSuperAdmin,
    isAdmin,
    isEmployee,
    refreshData,
    isTrialActive,
    daysLeftInTrial,
    hasPaidSubscription,
    subscriptionPlan
  };

  return { 
    organizationData,
    loading: orgLoading || profileLoading 
  };
};
