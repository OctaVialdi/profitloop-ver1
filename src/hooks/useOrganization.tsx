
import { useState, useEffect } from "react";
import { OrganizationData } from "@/types/organization";
import { fetchOrganizationData } from "./organization/useOrganizationData";
import { useAuthStateListener } from "./organization/useAuthStateListener";
import { useOrganizationSubscription } from "./organization/useOrganizationSubscription";
import { useOrganizationNavigation } from "./organization/useOrganizationNavigation";

export function useOrganization(): OrganizationData {
  const { navigate } = useOrganizationNavigation();
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
    refreshData: async () => await fetchOrganizationData(setOrganizationData, navigate)
  });
  
  // Initialize data fetching
  useEffect(() => {
    fetchOrganizationData(setOrganizationData, navigate);
  }, [navigate]);
  
  // Set up auth state change listener
  useAuthStateListener(organizationData, organizationData.refreshData);
  
  // Set up organization subscription listener
  useOrganizationSubscription(organizationData, organizationData.refreshData);

  return organizationData;
}
