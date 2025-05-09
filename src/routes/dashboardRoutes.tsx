
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Notifications from "@/pages/dashboard/Notifications";
import CatatanMeetings from "@/pages/CatatanMeetings";
import Components from "@/pages/dev/Components";

export const dashboardRoutes = [
  <Route
    key="dashboard"
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
  </Route>,
  <Route
    key="catatan-meetings"
    path="/catatan-meetings"
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<CatatanMeetings />} />
  </Route>,
  <Route
    key="dev"
    path="/dev"
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route path="components" element={<Components />} />
    {/* Default redirect for /dev path */}
    <Route path="" element={<Navigate to="/dev/components" replace />} />
  </Route>
];
