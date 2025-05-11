
import { Navigate, RouteObject } from "react-router-dom";

// Auth routes
import { authRoutes } from "./authRoutes";

// Dashboard routes
import { dashboardRoutes } from "./dashboardRoutes";

// Settings routes
import { settingsRoutes } from "./settingsRoutes";

// Subscription routes
import SubscriptionSuccess from "@/pages/subscription/SubscriptionSuccess";

// Not found
import NotFound from "@/pages/NotFound";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  // Auth Routes
  ...authRoutes,
  
  // Dashboard
  ...dashboardRoutes,
  
  // Settings
  settingsRoutes as RouteObject,
  
  // Subscription
  {
    path: "/subscription/success",
    element: <SubscriptionSuccess />
  },
  
  // Not found
  {
    path: "*",
    element: <NotFound />,
  },
];
