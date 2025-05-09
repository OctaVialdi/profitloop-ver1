
import { BrowserRouter } from "react-router-dom";
import router from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { useAssetStorage } from "./hooks/useAssetStorage";
import TrialBanner from "@/components/TrialBanner";
import { useEffect } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { checkAndUpdateTrialStatus } from "@/services/subscriptionService";
import { trackSubscriptionEvent } from "@/utils/subscriptionUtils";
import { RouterProvider } from "react-router-dom";

function AppContent() {
  const { isTrialActive, organization } = useOrganization();
  
  // Force check trial status on app load
  useEffect(() => {
    const updateTrialStatus = async () => {
      if (organization?.id) {
        await checkAndUpdateTrialStatus(organization.id);
      }
    };
    
    updateTrialStatus();
  }, [organization?.id]);
  
  // Track app session start for analytics
  useEffect(() => {
    const trackSession = async () => {
      if (organization?.id) {
        await trackSubscriptionEvent('app_session_start', organization.id, {
          trial_active: isTrialActive,
          subscription_status: organization.subscription_status
        });
      }
    };
    
    trackSession();
    
    return () => {
      // Track session end on unmount
      if (organization?.id) {
        trackSubscriptionEvent('app_session_end', organization.id);
      }
    };
  }, [organization?.id, isTrialActive, organization?.subscription_status]);
  
  // Add or remove trial-expired class based on trial status
  useEffect(() => {
    if (organization?.trial_expired && organization?.subscription_status === 'expired') {
      document.body.classList.add('trial-expired');
    } else {
      document.body.classList.remove('trial-expired');
    }
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('trial-expired');
    };
  }, [organization?.trial_expired, organization?.subscription_status]);
  
  return (
    <>
      <TrialBanner />
      <RouterProvider router={router} />
    </>
  );
}

function App() {
  // Initialize asset storage
  useAssetStorage();

  return (
    <QueryProvider>
      <AppContent />
      <Toaster />
    </QueryProvider>
  );
}

export default App;
