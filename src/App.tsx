
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Pages
import Index from "./pages/Index";
import EmptyPage from "./pages/EmptyPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerificationSent from "./pages/auth/VerificationSent";
import OrganizationSetup from "./pages/onboarding/OrganizationSetup";
import WelcomePage from "./pages/WelcomePage";
import Dashboard from "./pages/dashboard/Dashboard";
import InviteMembers from "./pages/dashboard/InviteMembers";
import Subscription from "./pages/dashboard/Subscription";

// Layouts
import AuthLayout from "./components/layout/AuthLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

// Create a PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/empty" element={<EmptyPage />} />
          
          {/* Auth routes */}
          <Route 
            path="/auth/login" 
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } 
          />
          <Route 
            path="/auth/register" 
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            } 
          />
          <Route 
            path="/auth/verification-sent" 
            element={
              <AuthLayout>
                <VerificationSent />
              </AuthLayout>
            } 
          />
          
          {/* Onboarding routes - protected */}
          <Route path="/onboarding" element={
            <PrivateRoute>
              <OrganizationSetup />
            </PrivateRoute>
          } />
          <Route path="/welcome" element={
            <PrivateRoute>
              <WelcomePage />
            </PrivateRoute>
          } />
          
          {/* Dashboard routes - protected */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/invite" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <InviteMembers />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/subscription" 
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Subscription />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
