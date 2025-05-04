
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrganizationData } from "@/types/organization";

export function useOrganizationSubscription(
  organizationData: OrganizationData,
  refreshData: () => Promise<void>
) {
  useEffect(() => {
    // Set up listener for subscription changes
    const channel = supabase
      .channel('org-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'organizations',
          filter: organizationData.userProfile?.organization_id ? 
            `id=eq.${organizationData.userProfile.organization_id}` : undefined
        }, 
        () => {
          refreshData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationData.userProfile?.organization_id, refreshData]);
}
