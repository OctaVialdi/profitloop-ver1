
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrganizationData } from "./useOrganizationData";

export function useAuthStateListener(
  organizationData: OrganizationData, 
  refreshData: () => Promise<void>
) {
  // Listen for auth state changes and refresh data when needed
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          await refreshData();
        }
      }
    );
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [refreshData]);
}
