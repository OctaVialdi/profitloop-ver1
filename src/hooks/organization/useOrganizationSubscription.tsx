
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrganizationData } from "@/types/organization";

export function useOrganizationSubscription(organizationData: OrganizationData, refreshCallback: () => Promise<void>) {
  useEffect(() => {
    if (!organizationData.organization?.id) return;
    
    // Set up subscription for real-time organization updates
    const subscription = supabase
      .channel(`organization-${organizationData.organization.id}`)
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'organizations',
          filter: `id=eq.${organizationData.organization.id}`
        },
        (payload) => {
          console.log('Organization changed:', payload);
          refreshCallback();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [organizationData.organization?.id, refreshCallback]);
}
