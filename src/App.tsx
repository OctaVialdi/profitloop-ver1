
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppRoutes } from "./routes";
import TrialBanner from "./components/TrialBanner";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <TrialBanner />
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
