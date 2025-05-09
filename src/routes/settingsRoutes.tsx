
import { Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import SettingsLayout from "@/components/layout/SettingsLayout";
import ProfileSettings from "@/pages/settings/ProfileSettings";
import Subscription from "@/pages/dashboard/Subscription";
import OrganizationSettings from "@/pages/dashboard/OrganizationSettings";
import MemberManagement from "@/pages/dashboard/MemberManagement";
import OrganizationCollaboration from "@/pages/dashboard/OrganizationCollaboration";

export const settingsRoutes = [
  <Route
    key="settings"
    path="/settings"
    element={<SettingsLayout><Outlet /></SettingsLayout>}
  >
    <Route index element={<Navigate to="/settings/profile" replace />} />
    <Route path="profile" element={<ProfileSettings />} />
    <Route path="subscription" element={<Subscription />} />
    <Route path="organization" element={<OrganizationSettings />} />
    <Route path="members" element={<MemberManagement />} />
    <Route path="collaboration" element={<OrganizationCollaboration />} />
  </Route>
];
