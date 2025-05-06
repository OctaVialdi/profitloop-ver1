
import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { financeRoutes } from "./financeRoutes";
import { hrRoutes } from "./hrRoutes";
import { itRoutes } from "./itRoutes";
import { marketingRoutes } from "./marketingRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { settingsRoutes } from "./settingsRoutes";
import { myInfoRoutes } from "./myInfoRoutes";
import { onboardingRoutes } from "./onboardingRoutes";
import { publicRoutes } from "./publicRoutes";

import NotFound from "@/pages/NotFound";

// Helper function to ensure all routes are of the correct type
const asRouteObject = (route: React.ReactElement | RouteObject): RouteObject => {
  if (React.isValidElement(route)) {
    // Convert JSX element to route object
    const props = route.props as {
      path?: string;
      element?: React.ReactNode;
      children?: React.ReactElement[];
    };
    
    return {
      path: props.path,
      element: props.element,
      children: props.children ? props.children.map(asRouteObject) : undefined,
      // Add any other properties from Route element that might be needed
    };
  }
  return route as RouteObject;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      // Other routes
      ...authRoutes.map(asRouteObject),
      ...dashboardRoutes.map(asRouteObject),
      asRouteObject(financeRoutes),
      asRouteObject(hrRoutes),
      asRouteObject(itRoutes),
      asRouteObject(marketingRoutes),
      asRouteObject(operationsRoutes),
      asRouteObject(settingsRoutes),
      asRouteObject(myInfoRoutes),
      ...onboardingRoutes.map(asRouteObject),
      ...publicRoutes.map(asRouteObject),
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
