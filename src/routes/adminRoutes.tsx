
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TrialManagementPage from "@/pages/admin/TrialManagementPage";

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    <ProtectedRoute requiredRoles={["super_admin"]}>
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
