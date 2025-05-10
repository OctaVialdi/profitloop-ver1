
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsLayout from "@/components/layout/SettingsLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import MemberManagement from "@/pages/dashboard/MemberManagement";
import InviteMembers from "@/pages/dashboard/InviteMembers";
import Subscription from "@/pages/settings/SubscriptionPage";
import SubscriptionExtension from "@/pages/settings/subscription/SubscriptionExtension";
import ProfileSettings from "@/pages/settings/ProfileSettings";
import { Outlet } from "react-router-dom";
import SubscriptionDashboard from "@/pages/settings/subscription/SubscriptionDashboard";
import SubscriptionSuccess from "@/pages/settings/subscription/SubscriptionSuccess";
import SubscriptionFaq from "@/pages/settings/subscription/SubscriptionFaq";
import AdminPage from "@/pages/settings/AdminPage";

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
    <Route path="subscription/dashboard" element={<SubscriptionDashboard />} />
    <Route path="subscription/request-extension" element={<SubscriptionExtension />} />
    <Route path="subscription/success" element={<SubscriptionSuccess />} />
    <Route path="subscription/faq" element={<SubscriptionFaq />} />
    <Route path="profile" element={<ProfileSettings />} />
    <Route path="admin" element={<AdminPage />} />
    <Route path="" element={<Navigate to="/settings/subscription" replace />} />
  </Route>
);
