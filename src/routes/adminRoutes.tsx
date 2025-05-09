
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TrialManagementPage from "@/pages/admin/TrialManagementPage";

export const adminRoutes = {
  path: "/admin",
  element: (
    <ProtectedRoute requiredRole="super_admin">
      <DashboardLayout>
        {/* Admin layout content */}
      </DashboardLayout>
    </ProtectedRoute>
  ),
  children: [
    {
      path: "trial-management",
      element: <TrialManagementPage />
    }
  ]
};
