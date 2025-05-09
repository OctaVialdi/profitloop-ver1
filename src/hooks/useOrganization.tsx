
import { useOrganizationData } from "./useOrganizationData";
import { useAuthStateListener } from "./organization/useAuthStateListener";
import { useOrganizationSubscription } from "./organization/useOrganizationSubscription";

export function useOrganization() {
  const organizationData = useOrganizationData();
  
  // Set up auth state change listener
  useAuthStateListener(organizationData, organizationData.refreshData);
  
  // Set up organization subscription listener
  useOrganizationSubscription(organizationData, organizationData.refreshData);

  return organizationData;
}
