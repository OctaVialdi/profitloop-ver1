
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppRoutes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
