import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

// Layouts
import AuthLayout from "@/components/layout/AuthLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerificationSent from "@/pages/auth/VerificationSent";
import AcceptInvitation from "@/pages/auth/AcceptInvitation";
import OrganizationSetup from "@/pages/onboarding/OrganizationSetup";
import WelcomePage from "@/pages/WelcomePage";
import Dashboard from "@/pages/dashboard/Dashboard";
import InviteMembers from "@/pages/dashboard/InviteMembers";
import MemberManagement from "@/pages/dashboard/MemberManagement";
import OrganizationCollaboration from "@/pages/dashboard/OrganizationCollaboration";
import Subscription from "@/pages/dashboard/Subscription";
import Notifications from "@/pages/dashboard/Notifications";
import NotFound from "@/pages/NotFound";
import OrganizationSettings from "./pages/dashboard/OrganizationSettings";
import { ThemeProvider } from "./components/ThemeProvider";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/verification-sent" element={<VerificationSent />} />
              <Route path="/auth/accept-invitation" element={<AcceptInvitation />} />
            </Route>
            
            {/* Onboarding */}
            <Route path="/onboarding" element={<OrganizationSetup />} />
            <Route path="/welcome" element={<WelcomePage />} />
            
            {/* Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/invite" element={<InviteMembers />} />
              <Route path="/members" element={<MemberManagement />} />
              <Route path="/collaborations" element={<OrganizationCollaboration />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/organization/settings" element={<OrganizationSettings />} />
              {/* Other dashboard routes */}
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
