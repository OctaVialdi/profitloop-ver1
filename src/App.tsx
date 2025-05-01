
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Suspense, lazy, useEffect } from "react";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerificationSent from "@/pages/auth/VerificationSent";
import AcceptInvitation from "@/pages/auth/AcceptInvitation";
import MagicLinkJoin from "./pages/auth/MagicLinkJoin";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsLayout from "@/components/layout/SettingsLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AuthLayout from "@/components/layout/AuthLayout";
import { AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded components
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Notifications = lazy(() => import("@/pages/dashboard/Notifications"));
const MemberManagement = lazy(() => import("@/pages/dashboard/MemberManagement"));
const InviteMembers = lazy(() => import("@/pages/dashboard/InviteMembers"));
const OrganizationCollaboration = lazy(() => import("@/pages/dashboard/OrganizationCollaboration"));
const Subscription = lazy(() => import("@/pages/dashboard/Subscription"));
const OrganizationSettings = lazy(() => import("@/pages/dashboard/OrganizationSettings"));
const ProfileSettings = lazy(() => import("@/pages/settings/ProfileSettings"));
const OrganizationSetup = lazy(() => import("@/pages/onboarding/OrganizationSetup"));
const EmployeeWelcome = lazy(() => import("@/pages/employee/EmployeeWelcome"));
const CatatanMeetings = lazy(() => import("@/pages/CatatanMeetings"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center w-full min-h-[70vh] p-8">
    <div className="space-y-4 w-full max-w-md">
      <Skeleton className="h-8 w-[250px] mb-6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[80%]" />
      <div className="pt-4">
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

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
          <Route 
            path="/onboarding" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <OrganizationSetup />
              </Suspense>
            } 
          />
          <Route 
            path="/employee-welcome" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <EmployeeWelcome />
              </Suspense>
            } 
          />

          {/* Dashboard Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="notifications" element={
              <Suspense fallback={<LoadingFallback />}>
                <Notifications />
              </Suspense>
            } />
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
            <Route index element={
              <Suspense fallback={<LoadingFallback />}>
                <CatatanMeetings />
              </Suspense>
            } />
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
            <Route path="dashboard" element={
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="members" element={
              <Suspense fallback={<LoadingFallback />}>
                <MemberManagement />
              </Suspense>
            } />
            <Route path="invite" element={
              <Suspense fallback={<LoadingFallback />}>
                <InviteMembers />
              </Suspense>
            } />
            <Route path="collaborations" element={
              <Suspense fallback={<LoadingFallback />}>
                <OrganizationCollaboration />
              </Suspense>
            } />
            <Route path="subscription" element={
              <Suspense fallback={<LoadingFallback />}>
                <Subscription />
              </Suspense>
            } />
            <Route path="organization" element={
              <Suspense fallback={<LoadingFallback />}>
                <OrganizationSettings />
              </Suspense>
            } />
            <Route path="profile" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProfileSettings />
              </Suspense>
            } />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
