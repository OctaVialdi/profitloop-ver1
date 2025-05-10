
import { Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
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
import JoinOrganization from "@/pages/auth/JoinOrganization";
import JobApplicationForm from "@/pages/public/JobApplicationForm";
import ApplicationSuccess from "@/pages/public/ApplicationSuccess";
import JobPreviewPage from "@/pages/public/JobPreviewPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Components from "@/pages/dev/Components";
import HeaderOnlyLayout from "@/components/layout/HeaderOnlyLayout";
import { Navigate } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirects to login if not logged in */}
      {authRoutes}
      
      {/* Public Routes - Ensuring these are registered BEFORE protected routes for priority */}
      <Route path="/join-organization" element={<JoinOrganization />} />
      
      {/* Important: Preview route must come before the regular apply route to avoid conflicts */}
      <Route path="/apply/preview/:token" element={<JobPreviewPage />} />
      <Route path="/apply/:token" element={<JobApplicationForm />} />
      <Route path="/apply/success" element={<ApplicationSuccess />} />
      
      {/* Dev Routes */}
      <Route path="/dev" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="components" element={<Components />} />
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
      <Route element={<ProtectedRoute />}>
        {marketingRoutes}
      </Route>
      
      {/* IT Routes */}
      <Route element={<ProtectedRoute />}>
        {itRoutes}
      </Route>

      {/* Settings Routes */}
      <Route element={<ProtectedRoute />}>
        {settingsRoutes}
      </Route>

      {/* Catch all - This must always be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
