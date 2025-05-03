
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "@/routes";
import RootLayout from "@/components/layout/RootLayout";

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <AppRoutes />
        <Toaster position="top-center" />
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
