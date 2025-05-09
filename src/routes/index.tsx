
import { RouteObject } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { onboardingRoutes } from "./onboardingRoutes";
import { hrRoutes } from "./hrRoutes";
import { financeRoutes } from "./financeRoutes";
import { marketingRoutes } from "./marketingRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { itRoutes } from "./itRoutes";
import { myInfoRoutes } from "./myInfoRoutes";
import { settingsRoutes } from "./settingsRoutes";
import { adminRoutes } from "./adminRoutes";
import WelcomePage from "@/pages/WelcomePage";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import EmptyPage from "@/pages/EmptyPage";
import CatatanMeetings from "@/pages/CatatanMeetings";
import JobPreviewPage from "@/pages/public/JobPreviewPage";
import JobApplicationForm from "@/pages/public/JobApplicationForm";
import ApplicationSuccess from "@/pages/public/ApplicationSuccess";
import Components from "@/pages/dev/Components";
import PremiumFeatureDemo from "@/pages/dev/PremiumFeatureDemo";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/welcome",
    element: <WelcomePage />
  },
  {
    path: "/empty",
    element: <EmptyPage />
  },
  {
    path: "/catatan",
    element: <CatatanMeetings />
  },
  {
    path: "/job/:token",
    element: <JobPreviewPage />
  },
  {
    path: "/apply/:token",
    element: <JobApplicationForm />
  },
  {
    path: "/apply/success",
    element: <ApplicationSuccess />
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
