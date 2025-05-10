
import { Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { rootRedirect, authRoutes } from "./authRoutes";
import { onboardingRoutes } from "./onboardingRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { hrRoutes } from "./hrRoutes";
import { financeRoutes } from "./financeRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { marketingRoutes } from "./marketingRoutes";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* Root redirect */}
    {rootRedirect}
    
    {/* Auth routes (public) */}
    {authRoutes}
    
    {/* Protected routes */}
    <Route path="/" element={
      <ProtectedRoute>
        {dashboardRoutes}
      </ProtectedRoute>
    } />
    
    {/* Onboarding routes */}
    <Route path="/onboarding/*" element={
      <ProtectedRoute>
        {onboardingRoutes}
      </ProtectedRoute>
    } />
    
    {/* HR routes */}
    <Route path="/hr/*" element={
      <ProtectedRoute>
        {hrRoutes}
      </ProtectedRoute>
    } />
    
    {/* Finance routes */}
    <Route path="/finance/*" element={
      <ProtectedRoute>
        {financeRoutes}
      </ProtectedRoute>
    } />
    
    {/* Operations routes */}
    <Route path="/operations/*" element={
      <ProtectedRoute>
        {operationsRoutes}
      </ProtectedRoute>
    } />
    
    {/* Marketing routes */}
    <Route path="/marketing/*" element={
      <ProtectedRoute>
        {marketingRoutes}
      </ProtectedRoute>
    } />
    
    {/* Not found */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
