
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { OrganizationData } from "@/types/organization";
import { getUserProfile, getOrganization, getSubscriptionPlan, checkTrialExpiration } from "@/services/organizationService";
import { calculateTrialStatus, calculateSubscriptionStatus, calculateUserRoles } from "@/utils/organizationUtils";

export function useOrganization(): OrganizationData {
  const [organizationData, setOrganizationData] = useState<OrganizationData>({
    organization: null,
    subscriptionPlan: null,
    userProfile: null,
    isLoading: true,
    error: null,
    isSuperAdmin: false,
    isAdmin: false,
    isEmployee: false,
    isTrialActive: false,
    daysLeftInTrial: 0,
    hasPaidSubscription: false,
    refreshData: fetchOrganizationData
  });
  const navigate = useNavigate();

  async function fetchOrganizationData() {
    setOrganizationData(current => ({ ...current, isLoading: true, error: null }));
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth/login');
        return;
      }
      
      // Get user profile
      const profile = await getUserProfile(session.user.id);
      
      if (!profile) {
        console.log("No profile found, redirecting to onboarding");
        navigate('/onboarding');
        return;
      }
      
      if (!profile.organization_id) {
        console.log("No organization associated with profile, redirecting to onboarding");
        navigate('/onboarding');
        return;
      }
      
      // Get organization data
      const organization = await getOrganization(profile.organization_id);
      
      if (!organization) {
        throw new Error("Organisasi tidak ditemukan");
      }
      
      // Get subscription plan data if available
      let subscriptionPlan = null;
      if (organization.subscription_plan_id) {
        subscriptionPlan = await getSubscriptionPlan(organization.subscription_plan_id);
      }
      
      // Calculate derived state
      const { isTrialActive, daysLeftInTrial } = calculateTrialStatus(organization);
      const hasPaidSubscription = calculateSubscriptionStatus(organization, subscriptionPlan);
      const { isSuperAdmin, isAdmin, isEmployee } = calculateUserRoles(profile);
      
      // Check if trial has expired but not marked as expired
      if (organization.trial_end_date && 
          new Date(organization.trial_end_date) < new Date() && 
          !organization.trial_expired) {
        // Trigger the edge function to check trial expiration
        checkTrialExpiration();
      }
      
      setOrganizationData({
        organization,
        subscriptionPlan,
        userProfile: profile,
        isLoading: false,
        error: null,
        isSuperAdmin,
        isAdmin,
        isEmployee,
        isTrialActive,
        daysLeftInTrial,
        hasPaidSubscription,
        refreshData: fetchOrganizationData
      });
    } catch (err: any) {
      console.error("Error fetching organization data:", err);
      setOrganizationData(current => ({
        ...current,
        isLoading: false,
        error: err as Error
      }));
      toast.error("Gagal memuat data organisasi");
    }
  }

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
          filter: organizationData.userProfile?.organization_id ? `id=eq.${organizationData.userProfile.organization_id}` : undefined
        }, 
        () => {
          fetchOrganizationData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationData.userProfile?.organization_id]);

  return organizationData;
}
