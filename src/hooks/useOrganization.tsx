
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrganizationData, SubscriptionPlan } from "@/types/organization";
import { fetchOrganizationData } from "./organization/useOrganizationData";
import { useAuthStateListener } from "./organization/useAuthStateListener";
import { useOrganizationSubscription } from "./organization/useOrganizationSubscription";
import { calculateTrialStatus, calculateSubscriptionStatus } from "@/utils/organizationUtils";

export function useOrganization(): OrganizationData {
  const [organizationData, setOrganizationData] = useState<OrganizationData>({
    organization: null,
    userProfile: null,
    isLoading: true,
    error: null,
    isSuperAdmin: false,
    isAdmin: false,
    isEmployee: false,
    isTrialActive: false,
    daysLeftInTrial: 0,
    hasPaidSubscription: false,
    subscriptionPlan: null,
    refreshData: async () => await fetchOrganizationData(setOrganizationData, navigate)
  });
  
  const navigate = useNavigate();
  
  // Initialize data fetching
  useEffect(() => {
    fetchOrganizationData(setOrganizationData, navigate);
  }, [navigate]);
  
  // Calculate trial and subscription status whenever organization data changes
  useEffect(() => {
    if (organizationData.organization) {
      const { isTrialActive, daysLeftInTrial } = calculateTrialStatus(organizationData.organization);
      const hasPaidSubscription = calculateSubscriptionStatus(
        organizationData.organization,
        organizationData.subscriptionPlan
      );
      
      if (
        isTrialActive !== organizationData.isTrialActive ||
        daysLeftInTrial !== organizationData.daysLeftInTrial ||
        hasPaidSubscription !== organizationData.hasPaidSubscription
      ) {
        setOrganizationData(prevData => ({
          ...prevData,
          isTrialActive,
          daysLeftInTrial,
          hasPaidSubscription
        }));
      }
    }
  }, [organizationData.organization, organizationData.subscriptionPlan]);
  
  // Set up auth state change listener
  useAuthStateListener(organizationData, organizationData.refreshData);
  
  // Set up organization subscription listener
  useOrganizationSubscription(organizationData, organizationData.refreshData);

  return organizationData;
}
