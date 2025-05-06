
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { onboardingRoutes } from "./onboardingRoutes";
import { hrRoutes } from "./hrRoutes";
import { financeRoutes } from "./financeRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { marketingRoutes } from "./marketingRoutes";
import { itRoutes } from "./itRoutes";
import { myInfoRoutes } from "./myInfoRoutes";
import { settingsRoutes } from "./settingsRoutes";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Apply from "@/pages/Apply";
import TrialProtection from "@/components/TrialProtection";

import EmptyPage from "@/pages/EmptyPage";
import NotFound from "@/pages/NotFound";
import WelcomePage from "@/pages/WelcomePage";
import IndexPage from "@/pages/Index";

// Create browser router with proper route objects
const router = createBrowserRouter([
  // Public application form route (accessible without authentication)
  {
    path: "/apply/:token",
    element: <Apply />
  },
  // Application index page
  {
    path: "/",
    element: <IndexPage />
  },
  {
    path: "/welcome",
    element: <WelcomePage />
  },
  // Convert route elements to RouteObjects using the spread operator for arrays of routes
  ...(authRoutes as RouteObject[]),
  ...(onboardingRoutes as RouteObject[]),
  ...(dashboardRoutes as RouteObject[]),
  // The single route objects - wrap in TrialProtection
  {
    path: "/hr",
    element: (
      <ProtectedRoute>
        <TrialProtection>
          <DashboardLayout>
            {hrRoutes}
          </DashboardLayout>
        </TrialProtection>
      </ProtectedRoute>
    )
  },
  {
    path: "/finance",
    element: (
      <ProtectedRoute>
        <TrialProtection>
          <DashboardLayout>
            {financeRoutes}
          </DashboardLayout>
        </TrialProtection>
      </ProtectedRoute>
    )
  },
  {
    path: "/operations",
    element: (
      <ProtectedRoute>
        <TrialProtection>
          <DashboardLayout>
            {operationsRoutes}
          </DashboardLayout>
        </TrialProtection>
      </ProtectedRoute>
    )
  },
  {
    path: "/marketing",
    element: (
      <ProtectedRoute>
        <TrialProtection>
          <DashboardLayout>
            {marketingRoutes}
          </DashboardLayout>
        </TrialProtection>
      </ProtectedRoute>
    )
  },
  {
    path: "/it",
    element: (
      <ProtectedRoute>
        <TrialProtection>
          <DashboardLayout>
            {itRoutes}
          </DashboardLayout>
        </TrialProtection>
      </ProtectedRoute>
    )
  },
  {
    path: "/my-info",
    element: (
      <ProtectedRoute>
        <TrialProtection>
          <DashboardLayout>
            {myInfoRoutes}
          </DashboardLayout>
        </TrialProtection>
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <TrialProtection>
          <DashboardLayout>
            {settingsRoutes}
          </DashboardLayout>
        </TrialProtection>
      </ProtectedRoute>
    )
  },
  {
    path: "/empty",
    element: (
      <ProtectedRoute>
        <TrialProtection>
          <DashboardLayout>
            <EmptyPage />
          </DashboardLayout>
        </TrialProtection>
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;
