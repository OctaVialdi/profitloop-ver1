
import { Route } from "react-router-dom";
import OrganizationSetup from "@/pages/onboarding/OrganizationSetup";
import EmployeeWelcome from "@/pages/employee/EmployeeWelcome";

export const onboardingRoutes = [
  <Route 
    key="org-setup" 
    path="/organizations" 
    element={<OrganizationSetup />} 
  />,
  <Route 
    key="onboarding" 
    path="/onboarding" 
    element={<OrganizationSetup />} 
  />,
  <Route 
    key="employee-welcome" 
    path="/employee-welcome" 
    element={<EmployeeWelcome />} 
  />,
];
