
import { Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import MyInfoLayout from "@/components/layout/MyInfoLayout";
import MyInfoIndex from "@/pages/my-info/MyInfoIndex";
import MyEmploymentPage from "@/pages/my-info/MyEmploymentPage";
import MyAssetsPage from "@/pages/my-info/MyAssetsPage";
import MyFilesPage from "@/pages/my-info/MyFilesPage";

export const myInfoRoutes = [
  <Route
    key="my-info"
    path="/my-info"
    element={<MyInfoLayout><Outlet /></MyInfoLayout>}
  >
    <Route index element={<MyInfoIndex />} />
    <Route path="employment" element={<MyEmploymentPage />} />
    <Route path="assets" element={<MyAssetsPage />} />
    <Route path="files" element={<MyFilesPage />} />
    <Route path="*" element={<Navigate to="/my-info" replace />} />
  </Route>
];
