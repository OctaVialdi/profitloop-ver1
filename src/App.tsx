
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { useAssetStorage } from "./hooks/useAssetStorage";
import TrialBanner from "@/components/TrialBanner";
import { useEffect } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { checkAndUpdateTrialStatus } from "@/services/subscriptionService";
import { trackSubscriptionEvent } from "@/utils/subscriptionUtils";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "@/styles/trial.css"; // Import trial styles explicitly

// AppContent is now removed as we're using RouterProvider directly

function App() {
  // Initialize asset storage
  useAssetStorage();

  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster />
    </QueryProvider>
  );
}

export default App;
