
import { RouteObject } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { settingsRoutes } from "./settingsRoutes";
import { onboardingRoutes } from "./onboardingRoutes";
import { hrRoutes } from "./hrRoutes";
import { financeRoutes } from "./financeRoutes";
import { marketingRoutes } from "./marketingRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { itRoutes } from "./itRoutes";
import { myInfoRoutes } from "./myInfoRoutes";
import { adminRoutes } from "./adminRoutes";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import WelcomePage from "@/pages/WelcomePage";
import MagicLinkJoin from "@/pages/auth/MagicLinkJoin";
import ApplicationSuccess from "@/pages/public/ApplicationSuccess";
import JobApplicationForm from "@/pages/public/JobApplicationForm";
import JobPreviewPage from "@/pages/public/JobPreviewPage";
import Components from "@/pages/dev/Components";
import PremiumFeatureDemo from "@/pages/dev/PremiumFeatureDemo";

// Define the routes
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/welcome",
    element: <WelcomePage />,
  },
  {
    path: "/invite/:token",
    element: <MagicLinkJoin />,
  },
  {
    path: "/public/job/:token",
    element: <JobPreviewPage />,
  },
  {
    path: "/public/job/:token/apply",
    element: <JobApplicationForm />,
  },
  {
    path: "/public/job/apply/success",
    element: <ApplicationSuccess />,
  },
  {
    path: "/dev/components",
    element: <Components />
  },
  {
    path: "/dev/premium-features",
    element: <PremiumFeatureDemo />
  },
  authRoutes as RouteObject,
  dashboardRoutes as RouteObject,
  onboardingRoutes as RouteObject,
  hrRoutes as RouteObject,
  financeRoutes as RouteObject,
  marketingRoutes as RouteObject,
  operationsRoutes as RouteObject,
  itRoutes as RouteObject,
  myInfoRoutes as RouteObject,
  settingsRoutes as RouteObject,
  adminRoutes as RouteObject,
  {
    path: "*",
    element: <NotFound />
  }
];
