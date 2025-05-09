
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrganizationData } from "@/types/organization";

export function useAuthStateListener(organizationData: OrganizationData, refreshCallback: () => Promise<void>) {
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      // Only refresh on specific auth events to avoid unnecessary refreshes
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        // Use setTimeout to prevent potential auth state deadlocks
        setTimeout(() => {
          refreshCallback();
        }, 0);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [refreshCallback]);
}
