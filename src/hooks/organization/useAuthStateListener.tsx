
import { useEffect } from "react";
import { OrganizationData } from "@/types/organization";
import { supabase } from "@/integrations/supabase/client";

// This is a simplified version for handling authentication state changes in the organization context
export function useAuthStateListener(
  organizationData: OrganizationData, 
  refreshFn: () => Promise<void>
) {
  useEffect(() => {
    // If there's no organization data loaded yet, no need to set up listener
    if (organizationData.isLoading) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      // On auth state changes that affect user identity, refresh organization data
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        console.log(`Auth state changed: ${event}, refreshing organization data`);
        
        // When auth state changes, refresh organization data
        setTimeout(() => {
          refreshFn();
        }, 500); // Small delay to avoid race conditions
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [organizationData.isLoading, refreshFn]);
}
