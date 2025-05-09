
import { createBrowserRouter, RouteObject } from "react-router-dom";
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
import { Outlet } from "react-router-dom";
import TrialBanner from "@/components/TrialBanner";

// Root layout component that includes trial-related functionality
const RootLayout = () => {
  return (
    <>
      <TrialBanner />
      <Outlet />
    </>
  );
};

// Application Routes
const applicationRoutes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
];

// Convert element routes to RouteObject format
const convertToRouteObjects = (routes: any): RouteObject[] => {
  if (Array.isArray(routes)) {
    return routes.map(route => convertToRouteObjects(route)).flat();
  }
  return [routes];
};

// Create the router with all routes
const router = createBrowserRouter([
  ...applicationRoutes,
  ...convertToRouteObjects(authRoutes),
  ...convertToRouteObjects(dashboardRoutes),
  ...convertToRouteObjects(hrRoutes),
  ...convertToRouteObjects(financeRoutes),
  ...convertToRouteObjects(marketingRoutes),
  ...convertToRouteObjects(operationsRoutes),
  ...convertToRouteObjects(itRoutes),
  ...convertToRouteObjects(myInfoRoutes),
  ...convertToRouteObjects(settingsRoutes),
  ...convertToRouteObjects(onboardingRoutes),
  ...convertToRouteObjects(paymentRoutes)
]);

export default router;
