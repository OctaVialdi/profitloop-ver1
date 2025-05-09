
import { Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import MarketingLayout from "@/components/layout/MarketingLayout";
import SocialMediaManagement from "@/pages/marketing/SocialMediaManagement";
import SeoManagement from "@/pages/marketing/SeoManagement";
import AdsPerformance from "@/pages/marketing/AdsPerformance";
import KolManagement from "@/pages/marketing/KolManagement";
import RatingPerformance from "@/pages/marketing/RatingPerformance";
import AgencyComparison from "@/pages/marketing/AgencyComparison";

export const marketingRoutes = [
  <Route
    key="marketing"
    path="/marketing"
    element={<MarketingLayout><Outlet /></MarketingLayout>}
  >
    <Route index element={<Navigate to="/marketing/social-media" replace />} />
    <Route path="social-media" element={<SocialMediaManagement />} />
    <Route path="seo" element={<SeoManagement />} />
    <Route path="ads" element={<AdsPerformance />} />
    <Route path="kol" element={<KolManagement />} />
    <Route path="rating" element={<RatingPerformance />} />
    <Route path="agency-comparison" element={<AgencyComparison />} />
  </Route>
];
