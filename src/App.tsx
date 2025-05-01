
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerificationSent from "@/pages/auth/VerificationSent";
import AcceptInvitation from "@/pages/auth/AcceptInvitation";
import OrganizationSetup from "@/pages/onboarding/OrganizationSetup";
import EmployeeWelcome from "@/pages/employee/EmployeeWelcome";
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
import CatatanMeetings from "@/pages/CatatanMeetings";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";

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
        <Routes>
          {/* Root redirects to login */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verification-sent" element={<VerificationSent />} />
          </Route>
          
          {/* Accept Invitations - IMPORTANT: Making these routes more explicit */}
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
            {/* Redirect any unknown dashboard routes to main dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* New Catatan Meetings Route */}
          <Route
            path="/catatan-meetings"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CatatanMeetings />} />
          </Route>

          {/* Settings Layout */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsLayout>
                    <Outlet />
                  </SettingsLayout>
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
