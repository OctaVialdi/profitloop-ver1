
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MarketingLayout from "@/components/layout/MarketingLayout";
import AdsPerformance from "@/pages/marketing/AdsPerformance";
import SocialMediaManagement from "@/pages/marketing/SocialMediaManagement";
import KolManagement from "@/pages/marketing/KolManagement";
import SeoManagement from "@/pages/marketing/SeoManagement";
import RatingPerformance from "@/pages/marketing/RatingPerformance";
import AgencyComparison from "@/pages/marketing/AgencyComparison";
import Settings from "@/pages/marketing/Settings";
import { Outlet } from "react-router-dom";

// Import Social Media tab components
import SocialMediaDashboard from "@/pages/marketing/social-media/Dashboard";
import CreateContent from "@/pages/marketing/social-media/CreateContent";
import ContentBank from "@/pages/marketing/social-media/ContentBank";
import ContentQC from "@/pages/marketing/social-media/ContentQC";

export const marketingRoutes = (
  <Route
    key="marketing"
    path="/marketing"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <MarketingLayout>
            <Outlet />
          </MarketingLayout>
        </DashboardLayout>
      </ProtectedRoute>
    }
  >
    <Route path="ads-performance" element={<AdsPerformance />} />
    
    {/* Social Media Management with nested routes */}
    <Route path="social-media" element={<SocialMediaManagement />}>
      <Route index element={<SocialMediaDashboard />} />
      <Route path="create-content" element={<CreateContent />} />
      <Route path="content-bank" element={<ContentBank />} />
      <Route path="content-qc" element={<ContentQC />} />
    </Route>
    
    <Route path="kol" element={<KolManagement />} />
    <Route path="seo" element={<SeoManagement />} />
    <Route path="ratings" element={<RatingPerformance />} />
    <Route path="agency-comparison" element={<AgencyComparison />} />
    <Route path="settings" element={<Settings />} />
    {/* Redirect to ads performance if no path matches */}
    <Route path="" element={<Navigate to="/marketing/ads-performance" replace />} />
  </Route>
);
