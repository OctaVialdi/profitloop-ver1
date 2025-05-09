
import { Fragment } from "react";
import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { hrRoutes } from "./hrRoutes";
import { itRoutes } from "./itRoutes";
import { onboardingRoutes } from "./onboardingRoutes";
import { settingsRoutes } from "./settingsRoutes";
import { myInfoRoutes } from "./myInfoRoutes";
import { marketingRoutes } from "./marketingRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { financeRoutes, paymentRoutes } from "./financeRoutes";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";

// Application Routes
const applicationRoutes = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "*",
    element: <NotFound />
  }
];

const router = createBrowserRouter([
  ...applicationRoutes,
  authRoutes,
  dashboardRoutes,
  hrRoutes,
  financeRoutes,
  marketingRoutes,
  operationsRoutes,
  itRoutes,
  myInfoRoutes,
  settingsRoutes,
  onboardingRoutes,
  paymentRoutes // Added payment routes
]);

export default router;
