
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
    refreshData: async () => {
      try {
        // Safe way to get navigate function, only if we're in a Router context
        let navFunction = undefined;
        try {
          navFunction = navigate;
        } catch (e) {
          console.warn("Navigation not available in current context");
        }
        return await fetchOrganizationData(setOrganizationData, navFunction);
      } catch (error) {
        console.error("Error refreshing organization data:", error);
      }
    }
  });
  
  // Use a try-catch block to safely get the navigate function
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    // This will catch the error if useNavigate is called outside a Router context
    console.warn("useNavigate must be used within a Router. Some organization features may be limited.");
  }
  
  // Initialize data fetching, only if navigate is available
  useEffect(() => {
    if (navigate) {
      fetchOrganizationData(setOrganizationData, navigate);
    }
  }, [navigate]);
  
  // Set up auth state change listener
  useAuthStateListener(organizationData, organizationData.refreshData);
  
  // Set up organization subscription listener
  useOrganizationSubscription(organizationData, organizationData.refreshData);

  return organizationData;
}
