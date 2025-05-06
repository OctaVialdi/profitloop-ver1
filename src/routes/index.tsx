
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

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirects to login */}
      {rootRedirect}

      {/* Auth Routes */}
      {authRoutes}
      
      {/* Join Organization Route - Public accessible */}
      <Route path="/join-organization" element={<JoinOrganization />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {onboardingRoutes}
      </Route>

      {/* Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        {dashboardRoutes}
      </Route>

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

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
