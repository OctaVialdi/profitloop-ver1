
import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicLayout } from "./layouts/PublicLayout";
import { MainLayout } from "./layouts/MainLayout";
import { useOrganization } from "./hooks/useOrganization";
import { checkAndUpdateTrialStatus } from "./services/subscriptionService";
import { trackAnalyticsEvent } from "@/services/subscriptionAnalyticsService";

// Lazy load route components
const Dashboard = React.lazy(() => import("@/pages/dashboard/Dashboard"));
const OperationsRoutes = React.lazy(() => import("@/pages/operations/OperationsRoutes"));
const HRRoutes = React.lazy(() => import("@/pages/hr/HRRoutes"));
const SettingsRoutes = React.lazy(() => import("@/pages/settings/SettingsRoutes"));
const EmployeeWelcomePage = React.lazy(() => import("@/pages/employee/EmployeeWelcomePage"));
const AdminRoutes = React.lazy(() => import("@/pages/admin/AdminRoutes"));
const TrialExpiredPage = React.lazy(() => import("@/pages/TrialExpiredPage"));

function App() {
  const { isLoggedIn } = useAuth();
  const { organization } = useOrganization();
  const location = useLocation();

  // State to track whether the component has mounted
  const [hasMounted, setHasMounted] = useState(false);

  // Effect to set hasMounted to true after the component mounts
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Effect to check and update trial status on component mount
  useEffect(() => {
    const checkTrial = async () => {
      if (organization?.id) {
        try {
          await checkAndUpdateTrialStatus(organization.id);
        } catch (error) {
          console.error("Failed to update trial status:", error);
        }
      }
    };

    checkTrial();
  }, [organization?.id]);

  // Render a loading indicator while the component mounts
  if (!hasMounted) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/*" element={<PublicLayout />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="dashboard" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="operations/*" element={
          <Suspense fallback={<div>Loading...</div>}>
            <OperationsRoutes />
          </Suspense>
        } />
        <Route path="hr/*" element={
          <Suspense fallback={<div>Loading...</div>}>
            <HRRoutes />
          </Suspense>
        } />
        <Route path="settings/*" element={
          <Suspense fallback={<div>Loading...</div>}>
            <SettingsRoutes />
          </Suspense>
        } />
        <Route path="employee-welcome" element={
          <Suspense fallback={<div>Loading...</div>}>
            <EmployeeWelcomePage />
          </Suspense>
        } />
        <Route path="admin/*" element={
          <Suspense fallback={<div>Loading...</div>}>
            <AdminRoutes />
          </Suspense>
        } />
      </Route>
      
      {/* Trial expired page */}
      <Route 
        path="/trial-expired" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <TrialExpiredPage />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect to dashboard if logged in, otherwise to login */}
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
