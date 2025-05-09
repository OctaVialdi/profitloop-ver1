
import { useState, useEffect } from "react";
import { OrganizationData } from "@/types/organization";
import { fetchOrganizationData } from "./organization/useOrganizationData";
import { useNavigate } from "react-router-dom";

// This hook is specifically for components that are already within a Router context
export function useOrganizationData(): OrganizationData {
  const navigate = useNavigate();
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

  return organizationData;
}
