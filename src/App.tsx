
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { useAssetStorage } from "./hooks/useAssetStorage";
import TrialBanner from "@/components/TrialBanner";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { trackSubscriptionEvent } from "@/utils/subscriptionUtils";

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
