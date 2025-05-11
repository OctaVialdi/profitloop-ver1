
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

// Convert routes to proper RouteObject format
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  
  // Auth Routes - Ensure they are properly converted to RouteObject format
  ...(Array.isArray(authRoutes) 
    ? authRoutes.map(route => route as unknown as RouteObject) 
    : [authRoutes] as RouteObject[]),
  
  // Dashboard Routes
  ...(Array.isArray(dashboardRoutes) 
    ? dashboardRoutes.map(route => route as unknown as RouteObject) 
    : [dashboardRoutes] as RouteObject[]),
  
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
