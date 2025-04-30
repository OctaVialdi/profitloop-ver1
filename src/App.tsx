
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
          
          {/* Onboarding routes */}
          <Route path="/onboarding" element={<OrganizationSetup />} />
          <Route path="/welcome" element={<WelcomePage />} />
          
          {/* Dashboard routes */}
          <Route 
            path="/dashboard" 
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/invite" 
            element={
              <DashboardLayout>
                <InviteMembers />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/subscription" 
            element={
              <DashboardLayout>
                <Subscription />
              </DashboardLayout>
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
