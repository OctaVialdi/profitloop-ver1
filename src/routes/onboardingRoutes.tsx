
import { Route } from "react-router-dom";
import OrganizationSetup from "@/pages/onboarding/OrganizationSetup";
import EmployeeWelcome from "@/pages/employee/EmployeeWelcome";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const onboardingRoutes = [
  <Route 
    key="org-setup" 
    path="/onboarding" 
    element={
      <ProtectedRoute>
        <OrganizationSetup />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="employee-welcome" 
    path="/employee-welcome" 
    element={
      <ProtectedRoute>
        <EmployeeWelcome />
      </ProtectedRoute>
    } 
  />,
];
