
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
import WelcomePage from "@/pages/WelcomePage";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import EmptyPage from "@/pages/EmptyPage";
import CatatanMeetings from "@/pages/CatatanMeetings";
import JobPreviewPage from "@/pages/public/JobPreviewPage";
import JobApplicationForm from "@/pages/public/JobApplicationForm";
import ApplicationSuccess from "@/pages/public/ApplicationSuccess";
import Components from "@/pages/dev/Components";

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
  authRoutes,
  dashboardRoutes,
  onboardingRoutes,
  hrRoutes,
  financeRoutes,
  marketingRoutes,
  operationsRoutes,
  itRoutes,
  myInfoRoutes,
  settingsRoutes,
  {
    path: "*",
    element: <NotFound />
  }
];

// Re-export routes so it can be imported as { routes } from '@/routes'
export { routes };
