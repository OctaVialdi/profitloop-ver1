import { createBrowserRouter } from "react-router-dom";

import App from "../App";
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

import { NotFound } from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Other routes
      authRoutes,
      dashboardRoutes,
      financeRoutes,
      hrRoutes,
      itRoutes,
      marketingRoutes,
      operationsRoutes,
      settingsRoutes,
      myInfoRoutes,
      onboardingRoutes,
      publicRoutes,
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
