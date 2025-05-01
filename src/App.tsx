
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NotificationSystem } from "@/components/NotificationSystem";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerificationSent from "@/pages/auth/VerificationSent";
import AcceptInvitation from "@/pages/auth/AcceptInvitation";
import { OrganizationSetup } from "@/pages/onboarding/OrganizationSetup";
import { EmployeeWelcome } from "@/pages/employee/EmployeeWelcome";
import Dashboard from "@/pages/dashboard/Dashboard";
import Notifications from "@/pages/dashboard/Notifications";
import MemberManagement from "@/pages/dashboard/MemberManagement";
import InviteMembers from "@/pages/dashboard/InviteMembers";
import OrganizationCollaboration from "@/pages/dashboard/OrganizationCollaboration";
import Subscription from "@/pages/dashboard/Subscription";
import OrganizationSettings from "@/pages/dashboard/OrganizationSettings";
import ProfileSettings from "@/pages/settings/ProfileSettings";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsLayout from "@/components/layout/SettingsLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AuthLayout from "@/components/layout/AuthLayout";
import MagicLinkJoin from "./pages/auth/MagicLinkJoin";
import { useEffect } from "react";

function App() {
  // Check if the app is running in a development environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log the environment status to the console
  useEffect(() => {
    console.log(`App is running in ${isDevelopment ? 'development' : 'production'} mode.`);
  }, [isDevelopment]);

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <NotificationSystem />
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Index />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verification-sent" element={<VerificationSent />} />
          </Route>
          
          {/* Accept Invitations */}
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          <Route path="/join-organization" element={<MagicLinkJoin />} />

          {/* Protected Routes */}
          <Route path="/onboarding" element={<OrganizationSetup />} />
          <Route path="/employee-welcome" element={<EmployeeWelcome />} />

          {/* Dashboard Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Settings Layout */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsLayout />
                </DashboardLayout>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="members" element={<MemberManagement />} />
            <Route path="invite" element={<InviteMembers />} />
            <Route path="collaborations" element={<OrganizationCollaboration />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="organization" element={<OrganizationSettings />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
