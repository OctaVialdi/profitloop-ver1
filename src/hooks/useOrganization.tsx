
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrganizationData, SubscriptionPlan } from "@/types/organization";
import { fetchOrganizationData } from "./organization/useOrganizationData";
import { useAuthStateListener } from "./organization/useAuthStateListener";
import { useOrganizationSubscription } from "./organization/useOrganizationSubscription";
import { supabase } from "@/integrations/supabase/client";

export function useOrganization(): OrganizationData {
  const [organizationData, setOrganizationData] = useState<OrganizationData>({
    organization: null,
    userProfile: null,
    isLoading: true,
    error: null,
    isSuperAdmin: false,
    isAdmin: false,
    isEmployee: false,
    subscriptionPlan: null,
    refreshData: async () => await fetchOrganizationData(setOrganizationData, navigate)
  });
  
  const navigate = useNavigate();
  
  // Initialize data fetching
  useEffect(() => {
    fetchOrganizationData(setOrganizationData, navigate);
  }, [navigate]);

  // Set up auth state change listener
  useAuthStateListener(organizationData, organizationData.refreshData);

  // Set up organization subscription listener
  useOrganizationSubscription(organizationData, organizationData.refreshData);

  // Fetch and set subscription plan information
  useEffect(() => {
    const fetchSubscriptionPlan = async () => {
      if (organizationData.organization?.subscription_plan_id) {
        try {
          const { data, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('id', organizationData.organization.subscription_plan_id)
            .single();

          if (error) {
            console.error('Error fetching subscription plan:', error);
            return;
          }

          if (data) {
            setOrganizationData(prev => ({
              ...prev,
              subscriptionPlan: {
                ...data,
                features: data.features as Record<string, any> | null
              }
            }));
          }
        } catch (err) {
          console.error('Error in subscription plan fetch:', err);
        }
      }
    };

    fetchSubscriptionPlan();
  }, [organizationData.organization?.subscription_plan_id]);

  return organizationData;
}
