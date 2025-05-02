
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsLayout from "@/components/layout/SettingsLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import MemberManagement from "@/pages/dashboard/MemberManagement";
import InviteMembers from "@/pages/dashboard/InviteMembers";
import OrganizationCollaboration from "@/pages/dashboard/OrganizationCollaboration";
import Subscription from "@/pages/dashboard/Subscription";
import OrganizationSettings from "@/pages/dashboard/OrganizationSettings";
import ProfileSettings from "@/pages/settings/ProfileSettings";
import { Outlet } from "react-router-dom";

export const settingsRoutes = (
  <Route
    key="settings"
    path="/settings"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <SettingsLayout>
            <Outlet />
          </SettingsLayout>
        </DashboardLayout>
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="members" element={<MemberManagement />} />
    <Route path="invite" element={<InviteMembers />} />
    <Route path="collaborations" element={<OrganizationCollaboration />} />
    <Route path="subscription" element={<Subscription />} />
    <Route path="organization" element={<OrganizationSettings />} />
    <Route path="profile" element={<ProfileSettings />} />
  </Route>
);
