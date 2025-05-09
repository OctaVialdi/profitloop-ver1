
import { Route, Navigate } from "react-router-dom";
import ITLayout from "@/components/layout/ITLayout";
import Dashboard from "@/pages/it/Dashboard";
import Support from "@/pages/it/Support";
import TicketSystem from "@/pages/it/TicketSystem";
import Developer from "@/pages/it/Developer";

export const itRoutes = [
  <Route
    key="it"
    path="/it"
    element={<ITLayout />}
  >
    <Route index element={<Navigate to="/it/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="support" element={<Support />} />
    <Route path="ticket-system" element={<TicketSystem />} />
    <Route path="developer" element={<Developer />} />
  </Route>
];
