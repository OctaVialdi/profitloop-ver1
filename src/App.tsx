
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppRoutes } from "./routes";
import TrialProtection from "./components/TrialProtection";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <TrialProtection>
          <AppRoutes />
        </TrialProtection>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
