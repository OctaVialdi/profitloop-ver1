
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import MarketingLayout from "@/components/layout/MarketingLayout";

const KolManagement = lazy(() => import("@/pages/marketing/KolManagement"));
const Settings = lazy(() => import("@/pages/marketing/Settings"));
const SocialMediaManagement = lazy(() => import("@/pages/marketing/SocialMediaManagement"));
const SeoManagement = lazy(() => import("@/pages/marketing/SeoManagement"));
const AdsPerformance = lazy(() => import("@/pages/marketing/AdsPerformance"));
const RatingPerformance = lazy(() => import("@/pages/marketing/RatingPerformance"));
const AgencyComparison = lazy(() => import("@/pages/marketing/AgencyComparison"));

export const marketingRoutes = {
  path: "/marketing",
  element: <MarketingLayout />,
  children: [
    {
      path: "",
      element: <Navigate to="/marketing/social-media" replace />,
    },
    {
      path: "social-media",
      element: <SocialMediaManagement />,
    },
    {
      path: "kol-management",
      element: <KolManagement />,
    },
    {
      path: "seo-management",
      element: <SeoManagement />,
    },
    {
      path: "ads-performance",
      element: <AdsPerformance />,
    },
    {
      path: "rating-performance",
      element: <RatingPerformance />,
    },
    {
      path: "agency-comparison",
      element: <AgencyComparison />,
    },
    {
      path: "settings",
      element: <Settings />,
    },
  ],
};
