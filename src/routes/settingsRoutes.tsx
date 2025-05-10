
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsLayout from "@/components/layout/SettingsLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import MemberManagement from "@/pages/dashboard/MemberManagement";
import InviteMembers from "@/pages/dashboard/InviteMembers";
import Subscription from "@/pages/settings/SubscriptionPage";
import ProfileSettings from "@/pages/settings/ProfileSettings";
import { Outlet } from "react-router-dom";
import SubscriptionSuccessPage from "@/pages/subscription/SuccessPage";

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
    <Route path="subscription" element={<Subscription />} />
    <Route path="subscription/sukses" element={<SubscriptionSuccessPage />} />
    <Route path="profile" element={<ProfileSettings />} />
    <Route path="" element={<Navigate to="/settings/subscription" replace />} />
  </Route>
);
