
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { useAssetStorage } from "./hooks/useAssetStorage";
import TrialBanner from "./components/TrialBanner";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

function App() {
  // Initialize asset storage
  useAssetStorage();

  // Run trial period fix on app load
  useEffect(() => {
    const fixTrialPeriods = async () => {
      try {
        // Check if the user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get organization ID from user metadata
          const orgId = session.user.user_metadata?.organization_id;
          
          if (orgId) {
            // Import function dynamically to avoid circular dependencies
            const { fixOrganizationTrialPeriod } = await import('./services/subscriptionService');
            await fixOrganizationTrialPeriod(orgId);
            console.log("Trial period check completed on app load");
          }
        }
      } catch (error) {
        console.error("Error fixing trial periods on app load:", error);
      }
    };

    fixTrialPeriods();
  }, []);

  return (
    <QueryProvider>
      <BrowserRouter>
        <TrialBanner />
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
