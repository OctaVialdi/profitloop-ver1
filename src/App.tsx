
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { useAssetStorage } from "./hooks/useAssetStorage";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "@/styles/trial.css"; // Import trial styles explicitly

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
