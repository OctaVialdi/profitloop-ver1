
import { Route } from "react-router-dom";
import OrganizationSetup from "@/pages/organizations/OrganizationSetup";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const organizationRoutes = (
  <Route 
    path="/organizations" 
    element={
      <ProtectedRoute>
        <OrganizationSetup />
      </ProtectedRoute>
    } 
  />
);
