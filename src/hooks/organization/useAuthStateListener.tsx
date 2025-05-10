
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrganizationData } from "@/types/organization";

export function useAuthStateListener(
  organizationData: OrganizationData,
  refreshData: () => Promise<void>
) {
  useEffect(() => {
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // If the user's token was refreshed or user was updated, 
        // check if organization_id in metadata has changed
        if (session && 
            session.user.user_metadata?.organization_id !== 
            organizationData.organization?.id) {
          console.log("Organization changed in user metadata, refreshing data");
          refreshData();
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [organizationData.organization?.id, refreshData]);
}
