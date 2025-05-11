
import { Navigate, Route, RouteObject } from "react-router-dom";

// Auth routes
import { authRoutes } from "./authRoutes";

// Dashboard routes
import { dashboardRoutes } from "./dashboardRoutes";

// Settings routes
import { settingsRoutes } from "./settingsRoutes";

// Subscription routes
import SubscriptionSuccess from "@/pages/subscription/SubscriptionSuccess";

// Recruitment routes
import { recruitmentRoutes } from "./recruitmentRoutes";

// Employee routes
import { employeeRoutes } from "./employeeRoutes";

// Public routes
import Homepage from "@/pages/Homepage";
import { RecruitmentPublicRoutes } from "./recruitmentPublicRoutes";
import NotFound from "@/pages/NotFound";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Homepage />,
  },
  // Auth Routes
  ...authRoutes,
  
  // Dashboard
  ...dashboardRoutes,
  
  // Settings
  settingsRoutes,
  
  // Subscription
  {
    path: "/subscription/success",
    element: <SubscriptionSuccess />
  },
  
  // Recruitment
  ...recruitmentRoutes,
  ...RecruitmentPublicRoutes,
  ...employeeRoutes,
  
  // Not found
  {
    path: "*",
    element: <NotFound />,
  },
];
