
import { useEffect } from "react";
import { OrganizationData } from "@/types/organization";
import { supabase } from "@/integrations/supabase/client";

// This is a simplified version for monitoring organization subscription changes
export function useOrganizationSubscription(
  organizationData: OrganizationData,
  refreshFn: () => Promise<void>
) {
  useEffect(() => {
    if (!organizationData.organization?.id || organizationData.isLoading) {
      return;
    }
    
    console.log("Setting up organization subscription listener");
    
    // Set up a channel to listen for organization table changes
    const channel = supabase
      .channel(`organization-${organizationData.organization.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'organizations',
        filter: `id=eq.${organizationData.organization.id}`
      }, () => {
        console.log("Organization updated, refreshing data");
        refreshFn();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationData.organization?.id, organizationData.isLoading, refreshFn]);
}
