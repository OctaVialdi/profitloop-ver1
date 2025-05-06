
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import router from "./routes";
import TrialProtection from "./components/TrialProtection";
import { QueryProvider } from "./components/QueryProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryProvider>
        <TrialProtection>
          <RouterProvider router={router} />
        </TrialProtection>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
