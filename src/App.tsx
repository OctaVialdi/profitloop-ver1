
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { useAssetStorage } from "./hooks/useAssetStorage";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";

function AppContent() {
  // Initialize asset storage
  useAssetStorage();

  return (
    <>
      <AppRoutes />
      <Toaster />
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
