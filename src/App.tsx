
import { ThemeProvider } from "@/components/ThemeProvider";
import router from "./routes";
import { RouterProvider } from "react-router-dom";
import { QueryProvider } from "./components/QueryProvider";
import TrialProtection from "./components/TrialProtection";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryProvider>
        {/* RouterProvider should wrap TrialProtection since 
            TrialProtection and its child components use router hooks */}
        <RouterProvider router={router} />
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
