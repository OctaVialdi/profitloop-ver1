
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OperationsLayout from "@/components/layout/OperationsLayout";
import OperationsDashboard from "@/pages/operations/Dashboard";
import CustomerServicePage from "@/pages/operations/CustomerService";
import SalesPage from "@/pages/operations/Sales";
import LogisticsPage from "@/pages/operations/Logistics";

export const operationsRoutes = (
  <Route
    key="operations"
    path="/operations"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <OperationsLayout>
            {/* Outlet will be rendered here */}
          </OperationsLayout>
        </DashboardLayout>
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<OperationsDashboard />} />
    <Route path="customer-service" element={<CustomerServicePage />} />
    <Route path="customer-service/tickets" element={<CustomerServicePage />} />
    <Route path="customer-service/kanban" element={<CustomerServicePage />} />
    <Route path="sales" element={<SalesPage />} />
    <Route path="logistics" element={<LogisticsPage />} />
    {/* Redirect to dashboard if no path matches */}
    <Route path="" element={<Navigate to="/operations/dashboard" replace />} />
  </Route>
);

