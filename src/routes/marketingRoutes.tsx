
import { lazy, Suspense } from "react";
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MarketingLayout from "@/components/layout/MarketingLayout";
import { Outlet } from "react-router-dom";

// Lazy loaded components
const AdsPerformance = lazy(() => import("@/pages/marketing/AdsPerformance"));
const SocialMediaManagement = lazy(() => import("@/pages/marketing/SocialMediaManagement"));
const KolManagement = lazy(() => import("@/pages/marketing/KolManagement"));
const SeoManagement = lazy(() => import("@/pages/marketing/SeoManagement"));
const RatingPerformance = lazy(() => import("@/pages/marketing/RatingPerformance"));
const AgencyComparison = lazy(() => import("@/pages/marketing/AgencyComparison"));
const Settings = lazy(() => import("@/pages/marketing/Settings"));
const ContentPlan = lazy(() => import("@/pages/marketing/components/ContentPlan"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
  </div>
);

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
    <Route path="ads-performance" element={
      <Suspense fallback={<LoadingFallback />}>
        <AdsPerformance />
      </Suspense>
    } />
    <Route path="social-media" element={
      <Suspense fallback={<LoadingFallback />}>
        <SocialMediaManagement />
      </Suspense>
    } />
    <Route path="kol" element={
      <Suspense fallback={<LoadingFallback />}>
        <KolManagement />
      </Suspense>
    } />
    <Route path="seo" element={
      <Suspense fallback={<LoadingFallback />}>
        <SeoManagement />
      </Suspense>
    } />
    <Route path="ratings" element={
      <Suspense fallback={<LoadingFallback />}>
        <RatingPerformance />
      </Suspense>
    } />
    <Route path="agency-comparison" element={
      <Suspense fallback={<LoadingFallback />}>
        <AgencyComparison />
      </Suspense>
    } />
    <Route path="content-plan" element={
      <Suspense fallback={<LoadingFallback />}>
        <ContentPlan />
      </Suspense>
    } />
    <Route path="settings" element={
      <Suspense fallback={<LoadingFallback />}>
        <Settings />
      </Suspense>
    } />
    {/* Redirect to ads performance if no path matches */}
    <Route path="" element={<Navigate to="/marketing/ads-performance" replace />} />
  </Route>
);
