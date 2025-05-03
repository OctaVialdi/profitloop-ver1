
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmployeePersonal from "@/pages/hr/employee/EmployeePersonal";
import EmployeeEmployment from "@/pages/hr/employee/EmployeeEmployment";
import MyInfoLayout from "@/components/layout/MyInfoLayout";

export const myInfoRoutes = (
  <Route
    key="my-info"
    path="/my-info"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <MyInfoLayout />
        </DashboardLayout>
      </ProtectedRoute>
    }
  >
    <Route path="index" element={<EmployeePersonal />} />
    <Route path="personal" element={<EmployeePersonal />} />
    <Route path="employment" element={<EmployeeEmployment />} />
  </Route>
);
