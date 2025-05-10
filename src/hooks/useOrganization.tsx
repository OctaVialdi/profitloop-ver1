import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrganizationData, SubscriptionPlan } from "@/types/organization";
import { useOrganizationData } from "./organization/useOrganizationData";
import { useAuthStateListener } from "./organization/useAuthStateListener";
import { useOrganizationSubscription } from "./organization/useOrganizationSubscription";
import { calculateTrialStatus, calculateSubscriptionStatus } from "@/utils/organizationUtils";

export function useOrganization(): OrganizationData {
  const organizationData = useOrganizationData();
  const navigate = useNavigate();
  
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
        // Values will be updated in useOrganizationData
      }
    }
  }, [organizationData.organization, organizationData.subscriptionPlan]);
  
  // Set up auth state change listener
  useAuthStateListener(organizationData, organizationData.refreshData);
  
  // Set up organization subscription listener
  useOrganizationSubscription(organizationData, organizationData.refreshData);

  return organizationData;
}
