
import { Route, Navigate, RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Notifications from "@/pages/dashboard/Notifications";
import CatatanMeetings from "@/pages/CatatanMeetings";
import Components from "@/pages/dev/Components";
import PremiumFeatureDemo from "@/pages/dev/PremiumFeatureDemo";

export const dashboardRoutes: RouteObject = {
  path: "/dashboard",
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { 
      path: "", 
      element: <Dashboard /> 
    },
    { 
      path: "notifications", 
      element: <Notifications /> 
    },
    // Redirect any unknown dashboard routes to main dashboard
    { 
      path: "*", 
      element: <Navigate to="/dashboard" replace /> 
    }
  ]
};

// Export additional routes separately
export const catatanMeetingsRoute: RouteObject = {
  path: "/catatan-meetings",
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { 
      path: "", 
      element: <CatatanMeetings /> 
    }
  ]
};

export const devRoutes: RouteObject = {
  path: "/dev",
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { 
      path: "components", 
      element: <Components /> 
    },
    { 
      path: "premium-features", 
      element: <PremiumFeatureDemo /> 
    },
    // Default redirect for /dev path
    { 
      path: "", 
      element: <Navigate to="/dev/components" replace /> 
    }
  ]
};
