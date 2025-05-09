
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrganizationData } from "@/types/organization";
import { fetchOrganizationData } from "./organization/useOrganizationData";
import { useAuthStateListener } from "./organization/useAuthStateListener";
import { useOrganizationSubscription } from "./organization/useOrganizationSubscription";

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
    refreshData: async () => await fetchOrganizationData(setOrganizationData, navigate)
  });
  
  const navigate = useNavigate();
  
  // Debug logging on values change
  useEffect(() => {
    console.log("useOrganization hook - organization data:", {
      isTrialActive: organizationData.isTrialActive,
      daysLeftInTrial: organizationData.daysLeftInTrial,
      hasPaidSubscription: organizationData.hasPaidSubscription,
      organization: organizationData.organization
    });
  }, [
    organizationData.isTrialActive, 
    organizationData.daysLeftInTrial,
    organizationData.hasPaidSubscription,
    organizationData.organization
  ]);
  
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
