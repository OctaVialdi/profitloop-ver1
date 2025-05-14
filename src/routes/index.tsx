
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { rootRedirect, authRoutes } from "./authRoutes";
import { onboardingRoutes } from "./onboardingRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { hrRoutes } from "./hrRoutes";
import { financeRoutes } from "./financeRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { marketingRoutes } from "./marketingRoutes";
import { itRoutes } from "./itRoutes";
import { settingsRoutes } from "./settingsRoutes";
import { myInfoRoutes } from "./myInfoRoutes";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HeaderOnlyLayout from "@/components/layout/HeaderOnlyLayout";
import { Navigate } from "react-router-dom";

// Lazy loaded components for public routes
const NotFound = lazy(() => import("@/pages/NotFound"));
const JoinOrganization = lazy(() => import("@/pages/auth/JoinOrganization"));
const JobApplicationForm = lazy(() => import("@/pages/public/JobApplicationForm"));
const ApplicationSuccess = lazy(() => import("@/pages/public/ApplicationSuccess"));
const JobPreviewPage = lazy(() => import("@/pages/public/JobPreviewPage"));
const Components = lazy(() => import("@/pages/dev/Components"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Root redirects to login if not logged in */}
        {authRoutes}
        
        {/* Public Routes - Ensuring these are registered BEFORE protected routes for priority */}
        <Route path="/join-organization" element={<Suspense fallback={<LoadingFallback />}><JoinOrganization /></Suspense>} />
        
        {/* Important: Preview route must come before the regular apply route to avoid conflicts */}
        <Route path="/apply/preview/:token" element={<Suspense fallback={<LoadingFallback />}><JobPreviewPage /></Suspense>} />
        <Route path="/apply/:token" element={<Suspense fallback={<LoadingFallback />}><JobApplicationForm /></Suspense>} />
        <Route path="/apply/success" element={<Suspense fallback={<LoadingFallback />}><ApplicationSuccess /></Suspense>} />
        
        {/* Dev Routes */}
        <Route path="/dev" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="components" element={<Suspense fallback={<LoadingFallback />}><Components /></Suspense>} />
        </Route>
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {onboardingRoutes}
        </Route>

        {/* Dashboard Routes (now root routes) */}
        <Route element={<ProtectedRoute />}>
          {dashboardRoutes}
        </Route>
        
        {/* Redirect /dashboard to root */}
        <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />

        {/* HR Routes */}
        <Route element={<ProtectedRoute />}>
          {hrRoutes}
        </Route>
        
        {/* My Info Routes */}
        <Route element={<ProtectedRoute />}>
          {myInfoRoutes}
        </Route>

        {/* Finance Routes */}
        <Route element={<ProtectedRoute />}>
          {financeRoutes}
        </Route>

        {/* Operations Routes */}
        <Route element={<ProtectedRoute />}>
          {operationsRoutes}
        </Route>
        
        {/* Marketing Routes */}
        <Route path="/marketing/*" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/*" element={marketingRoutes.element}>
                  {marketingRoutes.children.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))}
                </Route>
              </Routes>
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* IT Routes */}
        <Route element={<ProtectedRoute />}>
          {itRoutes}
        </Route>

        {/* Settings Routes */}
        <Route element={<ProtectedRoute />}>
          {settingsRoutes}
        </Route>

        {/* Catch all - This must always be last */}
        <Route path="*" element={<Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>} />
      </Routes>
    </Suspense>
  );
};
