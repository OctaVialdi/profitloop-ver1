import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicLayout } from "./layouts/PublicLayout";
import { MainLayout } from "./layouts/MainLayout";
import { useOrganization } from "./hooks/useOrganization";
import { checkAndUpdateTrialStatus } from "./services/subscriptionService";
import { trackAnalyticsEvent } from "@/services/subscriptionAnalyticsService";

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
        <Route index element={<React.lazy(() => import("@/pages/dashboard/Dashboard"))} />
        <Route path="dashboard" element={<React.lazy(() => import("@/pages/dashboard/Dashboard"))} />
        <Route path="operations/*" element={<React.lazy(() => import("@/pages/operations/OperationsRoutes"))} />
        <Route path="hr/*" element={<React.lazy(() => import("@/pages/hr/HRRoutes"))} />
        <Route path="settings/*" element={<React.lazy(() => import("@/pages/settings/SettingsRoutes"))} />
        <Route path="employee-welcome" element={<React.lazy(() => import("@/pages/employee/EmployeeWelcomePage"))} />
        <Route path="admin/*" element={<React.lazy(() => import("@/pages/admin/AdminRoutes"))} />
      </Route>
      
      {/* Trial expired page */}
      <Route 
        path="/trial-expired" 
        element={
          <ProtectedRoute>
            <React.lazy(() => import("@/pages/TrialExpiredPage")) />
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
