
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MyInfoLayout from "@/components/layout/MyInfoLayout";
import MyInfoIndex from "@/pages/my-info/MyInfoIndex";
import { Outlet } from "react-router-dom";

export const myInfoRoutes = (
  <Route
    key="my-info"
    path="/my-info"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <MyInfoLayout>
            <Outlet />
          </MyInfoLayout>
        </DashboardLayout>
      </ProtectedRoute>
    }
  >
    <Route path="index" element={<MyInfoIndex />} />
    <Route path="personal" element={<MyInfoIndex />} />
    <Route path="employment" element={<MyInfoIndex />} />
    <Route path="education" element={<MyInfoIndex />} />
    <Route path="files" element={<MyInfoIndex />} />
    <Route path="assets" element={<MyInfoIndex />} />
    <Route path="attendance" element={<MyInfoIndex />} />
    <Route path="schedule" element={<MyInfoIndex />} />
    <Route path="time-off" element={<MyInfoIndex />} />
    <Route path="payroll-info" element={<MyInfoIndex />} />
    <Route path="finance/reimbursement" element={<MyInfoIndex />} />
    <Route path="finance/cash-advance" element={<MyInfoIndex />} />
    <Route path="finance/loan" element={<MyInfoIndex />} />
    <Route path="history/adjustment" element={<MyInfoIndex />} />
    <Route path="history/transfer" element={<MyInfoIndex />} />
    <Route path="history/npp" element={<MyInfoIndex />} />
    <Route path="history/reprimand" element={<MyInfoIndex />} />
  </Route>
);
