
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { useAssetStorage } from "./hooks/useAssetStorage";
import TrialBanner from "@/components/TrialBanner";
import { useEffect } from "react";
import { useOrganization } from "@/hooks/useOrganization";

function AppContent() {
  const { isTrialActive, organization } = useOrganization();
  
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
      <AppRoutes />
    </>
  );
}

function App() {
  // Initialize asset storage
  useAssetStorage();

  return (
    <QueryProvider>
      <BrowserRouter>
        <AppContent />
        <Toaster />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
