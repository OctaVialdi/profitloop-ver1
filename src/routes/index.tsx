
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
  // HR routes - must be wrapped in an array since it's a single element
  hrRoutes,
  // Finance routes - already an array
  ...financeRoutes,
  // Operations routes - already an array
  ...operationsRoutes,
  // Marketing routes - already an array
  ...marketingRoutes,
  // IT routes - already an array
  ...itRoutes,
  // My Info routes - already an array
  ...myInfoRoutes,
  // Settings routes - already an array
  ...settingsRoutes,
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
