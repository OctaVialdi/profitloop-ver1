
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MyInfoLayout from "@/components/layout/MyInfoLayout";
import MyInfoIndex from "@/pages/my-info/MyInfoIndex";
import MyEmploymentPage from "@/pages/my-info/MyEmploymentPage";
import MyFilesPage from "@/pages/my-info/MyFilesPage";
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
    <Route path="employment" element={<MyEmploymentPage />} />
    <Route path="education" element={<MyInfoIndex />} />
    <Route path="files" element={<MyFilesPage />} />
    <Route path="assets" element={<MyInfoIndex />} />
    <Route path="attendance" element={<MyInfoIndex />} />
    <Route path="schedule" element={<MyInfoIndex />} />
    <Route path="time-off" element={<MyInfoIndex />} />
    <Route path="payroll-info" element={<MyInfoIndex />} />
    <Route path="reimbursement" element={<MyInfoIndex />} />
    <Route path="cash-advance" element={<MyInfoIndex />} />
    <Route path="loan" element={<MyInfoIndex />} />
    <Route path="adjustment" element={<MyInfoIndex />} />
    <Route path="transfer" element={<MyInfoIndex />} />
    <Route path="npp" element={<MyInfoIndex />} />
    <Route path="reprimand" element={<MyInfoIndex />} />
  </Route>
);
