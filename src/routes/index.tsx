
import { createBrowserRouter } from "react-router-dom";
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
  // Authentication routes - already an array
  ...authRoutes,
  // Onboarding routes - already an array
  ...onboardingRoutes,
  // Dashboard routes - already an array
  ...dashboardRoutes,
  // HR routes - not an array, just include directly
  hrRoutes,
  // Finance routes - not an array, just include directly
  financeRoutes,
  // Operations routes - not an array, just include directly
  operationsRoutes,
  // Marketing routes - not an array, just include directly
  marketingRoutes,
  // IT routes - not an array, just include directly
  itRoutes,
  // My Info routes - not an array, just include directly
  myInfoRoutes,
  // Settings routes - not an array, just include directly
  settingsRoutes,
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
