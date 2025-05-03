
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppRoutes } from "./routes";
import TrialBanner from "./components/TrialBanner";
import TrialProtection from "./components/TrialProtection";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <TrialBanner />
        <TrialProtection>
          <AppRoutes />
        </TrialProtection>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
