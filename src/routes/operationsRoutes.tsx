
import { Route, Navigate } from "react-router-dom";
import OperationsLayout from "@/components/layout/OperationsLayout";
import Dashboard from "@/pages/operations/Dashboard";
import CustomerService from "@/pages/operations/CustomerService";
import Logistics from "@/pages/operations/Logistics";
import Sales from "@/pages/operations/Sales";

export const operationsRoutes = [
  <Route
    key="operations"
    path="/operations"
    element={<OperationsLayout />}
  >
    <Route index element={<Navigate to="/operations/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="customer-service" element={<CustomerService />} />
    <Route path="logistics" element={<Logistics />} />
    <Route path="sales" element={<Sales />} />
  </Route>
];
