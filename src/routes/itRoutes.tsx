
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ITLayout from "@/components/layout/ITLayout";
import ITDashboard from "@/pages/it/Dashboard";
import ITSupport from "@/pages/it/Support";
import ITDeveloper from "@/pages/it/Developer";
import { Outlet } from "react-router-dom";
import TicketSystem from "@/pages/it/TicketSystem";

export const itRoutes = (
  <Route
    key="it"
    path="/it"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <ITLayout>
            <Outlet />
          </ITLayout>
        </DashboardLayout>
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<ITDashboard />} />
    <Route path="support" element={<ITSupport />} />
    <Route path="support/ticket-system" element={<TicketSystem />} />
    <Route path="developer" element={<ITDeveloper />} />
    {/* Redirect to dashboard if no path matches */}
    <Route path="" element={<Navigate to="/it/dashboard" replace />} />
  </Route>
);
