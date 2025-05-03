
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
  </Route>
);
