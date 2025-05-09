
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { useAssetStorage } from "./hooks/useAssetStorage";
import TrialBanner from "@/components/TrialBanner";

function App() {
  // Initialize asset storage
  useAssetStorage();

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
