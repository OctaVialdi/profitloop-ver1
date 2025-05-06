
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
  // Flatten and add authentication routes (array of elements)
  ...authRoutes,
  // Flatten and add onboarding routes (array of elements)
  ...onboardingRoutes,
  // Flatten and add dashboard routes (array of elements)
  ...dashboardRoutes,
  // The rest of the routes are single route objects (not arrays),
  // so we add them directly
  hrRoutes as RouteObject,
  financeRoutes as RouteObject,
  operationsRoutes as RouteObject,
  marketingRoutes as RouteObject,
  itRoutes as RouteObject,
  myInfoRoutes as RouteObject,
  settingsRoutes as RouteObject,
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
