
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { subscriptionService } from "@/services/subscriptionService";

// Import pages
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";

function App() {
  const { user } = useAuth();
  const { organization } = useOrganization();
  
  // Check for trial expiry on startup
  useEffect(() => {
    const checkTrialStatus = async () => {
      if (user && organization?.id) {
        try {
          // Check if organization trial needs fixing
          const result = await subscriptionService.fixOrganizationTrialPeriod(organization.id);
          
          if (result.success) {
            toast.info(result.message || "Your trial period has been adjusted based on your activity.");
          }
        } catch (error) {
          console.error("Error checking trial status:", error);
        }
      }
    };
    
    checkTrialStatus();
  }, [user, organization?.id]);
  
  return (
    <ThemeProvider defaultTheme="light">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/auth/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default route */}
          <Route path="*" element={<Login />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
