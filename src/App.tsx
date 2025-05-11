
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { useAssetStorage } from "./hooks/useAssetStorage";
import TrialBanner from "./components/TrialBanner";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { fixOrganizationTrialPeriod } from "./services/subscriptionService";
import { TrialExpiredModal } from "@/components/subscription/TrialExpiredModal";
import { useLocation } from "react-router-dom";

// Routes where we don't want to show the trial expired modal
const EXCLUDED_ROUTES = [
  '/settings/subscription',
  '/settings/subscription/request-extension',
  '/auth',
  '/login',
  '/register',
  '/reset-password',
];

function AppContent() {
  const assetStorage = useAssetStorage();
  const [showTrialExpiredModal, setShowTrialExpiredModal] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const location = useLocation();

  // Check if the current route is excluded from showing the trial modal
  const isExcludedRoute = EXCLUDED_ROUTES.some(route => location.pathname.startsWith(route));
  
  // Run trial period fix and check if trial has expired
  useEffect(() => {
    const checkTrialStatus = async () => {
      try {
        // Check if the user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get organization ID from user metadata
          const orgId = session.user.user_metadata?.organization_id;
          
          if (orgId) {
            // Fix organization trial period
            await fixOrganizationTrialPeriod(orgId);
            
            // Check if trial has expired
            const { data: orgData, error } = await supabase
              .from('organizations')
              .select('name, trial_expired, subscription_status, subscription_plan_id')
              .eq('id', orgId)
              .single();
            
            if (error) {
              console.error("Error fetching organization:", error);
              return;
            }
            
            // Show the trial expired modal if trial has expired, no active subscription, and not on excluded routes
            if (orgData && (orgData.trial_expired || orgData.subscription_status === 'expired') && 
                !orgData.subscription_plan_id && !isExcludedRoute) {
              setShowTrialExpiredModal(true);
              setOrganizationName(orgData.name || "your organization");
            }
          }
        }
      } catch (error) {
        console.error("Error checking trial status:", error);
      }
    };

    if (!isExcludedRoute) {
      checkTrialStatus();
    } else {
      setShowTrialExpiredModal(false);
    }
  }, [location.pathname, isExcludedRoute]);

  const handleUpgrade = () => {
    window.location.href = '/settings/subscription';
  };

  const handleRequestExtension = () => {
    window.location.href = '/settings/subscription/request-extension';
  };
  
  return (
    <>
      <TrialBanner />
      <AppRoutes />
      <Toaster />
      
      {/* Global Trial Expired Modal */}
      <TrialExpiredModal 
        isOpen={showTrialExpiredModal}
        onClose={() => setShowTrialExpiredModal(false)}
        onUpgrade={handleUpgrade}
        onRequest={handleRequestExtension}
        allowClose={true}
        organizationName={organizationName}
      />
    </>
  );
}

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
