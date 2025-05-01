
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import AuthLayout from "@/components/layout/AuthLayout";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerificationSent from "@/pages/auth/VerificationSent";
import OrganizationSetup from "@/pages/onboarding/OrganizationSetup";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import InviteMembers from "@/pages/dashboard/InviteMembers";
import OrganizationSettings from "@/pages/dashboard/OrganizationSettings";
import MemberManagement from "@/pages/dashboard/MemberManagement";
import Subscription from "@/pages/dashboard/Subscription";
import OrganizationCollaboration from "@/pages/dashboard/OrganizationCollaboration";
import Notifications from "@/pages/dashboard/Notifications";
import WelcomePage from "@/pages/WelcomePage";
// New imports
import AcceptInvitation from "@/pages/auth/AcceptInvitation";
import EmployeeWelcome from "@/pages/employee/EmployeeWelcome";
import SettingsLayout from "@/components/layout/SettingsLayout";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/verification-sent" element={<VerificationSent />} />
            <Route path="/accept-invitation" element={<AcceptInvitation />} />
          </Route>
          
          {/* Onboarding Routes */}
          <Route path="/onboarding" element={<OrganizationSetup />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/employee-welcome" element={<EmployeeWelcome />} />
          
          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<MemberManagement />} />
            <Route path="/notifications" element={<Notifications />} />
            
            {/* Settings Routes - All reorganized under /settings */}
            <Route path="/settings" element={
              <SettingsLayout>
                <Outlet />
              </SettingsLayout>
            }>
              <Route path="" element={<Navigate to="/settings/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="invite" element={<InviteMembers />} />
              <Route path="members" element={<MemberManagement />} />
              <Route path="collaborations" element={<OrganizationCollaboration />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="organization" element={<OrganizationSettings />} />
            </Route>
            
            {/* Legacy routes redirects */}
            <Route path="/invite" element={<Navigate to="/settings/invite" replace />} />
            <Route path="/organization/settings" element={<Navigate to="/settings/organization" replace />} />
            <Route path="/subscription" element={<Navigate to="/settings/subscription" replace />} />
            <Route path="/collaborations" element={<Navigate to="/settings/collaborations" replace />} />
          </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
