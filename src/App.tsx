
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import router from "./routes";
import TrialProtection from "./components/TrialProtection";
import { QueryProvider } from "./components/QueryProvider";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <QueryProvider>
          <TrialProtection>
            {/* Use the router directly instead of AppRoutes component */}
            {router}
          </TrialProtection>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
