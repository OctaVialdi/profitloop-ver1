
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
  // The single route objects
  hrRoutes as unknown as RouteObject,
  financeRoutes as unknown as RouteObject,
  operationsRoutes as unknown as RouteObject,
  marketingRoutes as unknown as RouteObject,
  itRoutes as unknown as RouteObject,
  myInfoRoutes as unknown as RouteObject,
  settingsRoutes as unknown as RouteObject,
  {
    path: "/empty",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <EmptyPage />
        </DashboardLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;
