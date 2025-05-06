
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
import Apply from "@/pages/Apply"; // Import the new Apply page

import EmptyPage from "@/pages/EmptyPage";
import NotFound from "@/pages/NotFound";
import WelcomePage from "@/pages/WelcomePage";
import IndexPage from "@/pages/Index";

// Create browser router
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
  // Authentication routes
  ...authRoutes,
  // Onboarding routes
  ...onboardingRoutes,
  // Dashboard routes
  ...dashboardRoutes,
  // HR routes (this is already one element, no spread needed)
  hrRoutes,
  // Finance routes
  ...financeRoutes,
  // Operations routes
  ...operationsRoutes,
  // Marketing routes
  ...marketingRoutes,
  // IT routes
  ...itRoutes,
  // My Info routes
  ...myInfoRoutes,
  // Settings routes
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
