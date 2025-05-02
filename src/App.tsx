
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppRoutes } from "./routes";
import { useEffect } from "react";

function App() {
  // Check if the app is running in a development environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log the environment status to the console
  useEffect(() => {
    console.log(`App is running in ${isDevelopment ? 'development' : 'production'} mode.`);
    
    // Handle domain mismatch - redirect if on app.profitloop.id in development
    if (window.location.hostname === 'app.profitloop.id' && isDevelopment) {
      window.location.href = `http://localhost:5173${window.location.pathname}${window.location.search}`;
    }

    // Improve scrolling performance
    document.documentElement.classList.add('antialiased');
    document.documentElement.classList.add('smooth-scrolling');

    // Add CSS to improve transitions
    const style = document.createElement('style');
    style.textContent = `
      .smooth-scrolling {
        scroll-behavior: smooth;
      }
      .antialiased * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      a, button {
        transition: all 0.2s ease;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isDevelopment]);

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
