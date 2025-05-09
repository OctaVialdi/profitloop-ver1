
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrganizationData } from "@/types/organization";

export function useOrganizationSubscription(
  organizationData: OrganizationData, 
  refreshCallback: () => Promise<void>
) {
  useEffect(() => {
    // Only set up subscription if we have an organization
    if (!organizationData.organization || !organizationData.organization.id) {
      return;
    }
    
    // Subscribe to changes in the organization table
    const orgSubscription = supabase
      .channel(`organization_${organizationData.organization.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organizations',
          filter: `id=eq.${organizationData.organization.id}`
        },
        () => {
          console.log("Organization data changed, refreshing...");
          // Use setTimeout to prevent potential state update deadlocks
          setTimeout(() => {
            refreshCallback();
          }, 0);
        }
      )
      .subscribe();
      
    // Subscribe to subscription plan changes
    if (organizationData.organization.subscription_plan_id) {
      const planSubscription = supabase
        .channel(`subscription_${organizationData.organization.subscription_plan_id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'subscription_plans',
            filter: `id=eq.${organizationData.organization.subscription_plan_id}`
          },
          () => {
            console.log("Subscription plan changed, refreshing...");
            // Use setTimeout to prevent potential state update deadlocks
            setTimeout(() => {
              refreshCallback();
            }, 0);
          }
        )
        .subscribe();
        
      return () => {
        orgSubscription.unsubscribe();
        planSubscription.unsubscribe();
      };
    }
    
    return () => {
      orgSubscription.unsubscribe();
    };
  }, [
    organizationData.organization?.id, 
    organizationData.organization?.subscription_plan_id,
    refreshCallback
  ]);
}
