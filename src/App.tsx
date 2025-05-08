
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { useAssetStorage } from "./hooks/useAssetStorage";

function App() {
  // Initialize asset storage
  useAssetStorage();

  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes />
        <Toaster />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
