
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsLayout from "@/components/layout/SettingsLayout";
import Subscription from "@/pages/settings/SubscriptionPage";
import SubscriptionExtension from "@/pages/settings/subscription/SubscriptionExtension";
import ProfileSettings from "@/pages/settings/ProfileSettings";
import { Outlet } from "react-router-dom";
import SubscriptionDashboard from "@/pages/settings/subscription/SubscriptionDashboard";
import SubscriptionFaq from "@/pages/settings/subscription/SubscriptionFaq";
import AdminPage from "@/pages/settings/AdminPage";
import SubscriptionManagement from "@/pages/settings/subscription/SubscriptionManagement";
import PlanSettings from "@/pages/settings/PlanSettings";
import BillingSettings from "@/pages/settings/BillingSettings";

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
    <Route path="subscription" element={<Subscription />} />
    <Route path="subscription/dashboard" element={<SubscriptionDashboard />} />
    <Route path="subscription/request-extension" element={<SubscriptionExtension />} />
    <Route path="subscription/faq" element={<SubscriptionFaq />} />
    <Route path="subscription/management" element={<SubscriptionManagement />} />
    <Route path="profile" element={<ProfileSettings />} />
    <Route path="plan" element={<PlanSettings />} />
    <Route path="billing" element={<BillingSettings />} />
    {/* Direct to subscription page by default */}
    <Route path="" element={<Navigate to="/settings/subscription" replace />} />
  </Route>
);
