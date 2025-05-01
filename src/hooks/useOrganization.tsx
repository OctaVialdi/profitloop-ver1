
import { useState, useEffect } from "react";
import { supabase, updateUserOrgMetadata } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { OrganizationData } from "@/types/organization";
import { getUserProfile, getOrganization, getSubscriptionPlan, checkTrialExpiration } from "@/services/organizationService";
import { calculateTrialStatus, calculateSubscriptionStatus, calculateUserRoles } from "@/utils/organizationUtils";
import { hardLogout } from "@/utils/authUtils";

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
        console.log("No session found, redirecting to login");
        navigate('/auth/login');
        return;
      }
      
      // Get user profile
      const profile = await getUserProfile(session.user.id);
      
      if (!profile) {
        console.log("No profile found, redirecting to onboarding");
        // Cek apakah ini kasus data yang tidak konsisten
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser && authUser.user) {
          console.log("Auth user exists but profile is missing - data inconsistency");
          toast.error("Terjadi ketidaksesuaian data. Mohon login kembali.");
          await hardLogout();
        }
        navigate('/onboarding');
        return;
      }
      
      if (!profile.organization_id) {
        console.log("No organization associated with profile, redirecting to onboarding");
        navigate('/onboarding');
        return;
      }

      // If organization_id exists but not in user metadata, update it
      if (profile.organization_id && 
          (!session.user.user_metadata?.organization_id || 
           session.user.user_metadata.organization_id !== profile.organization_id)) {
        console.log("Updating user metadata with organization ID:", profile.organization_id);
        await updateUserOrgMetadata(
          profile.organization_id, 
          profile.role || 'employee'
        );
      }
      
      // Get organization data
      const organization = await getOrganization(profile.organization_id);
      
      if (!organization) {
        console.error("Organization not found even though profile has organization_id");
        
        // Handle kasus di mana organization_id ada di profile tapi tidak ada di tabel organizations
        toast.error("Organisasi tidak ditemukan. Mohon buat organisasi baru.");
        
        // Update profile untuk menghapus organization_id yang tidak valid
        try {
          await supabase
            .from('profiles')
            .update({ organization_id: null })
            .eq('id', session.user.id);
            
          // Perbarui juga user metadata
          await updateUserOrgMetadata(null, profile.role || 'employee');
          
        } catch (updateErr) {
          console.error("Failed to clean up invalid organization_id:", updateErr);
        }
        
        navigate('/onboarding');
        return;
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
