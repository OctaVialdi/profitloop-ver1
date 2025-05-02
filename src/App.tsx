import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerificationSent from "@/pages/auth/VerificationSent";
import AcceptInvitation from "@/pages/auth/AcceptInvitation";
import OrganizationSetup from "@/pages/onboarding/OrganizationSetup";
import EmployeeWelcome from "@/pages/employee/EmployeeWelcome";
import Dashboard from "@/pages/dashboard/Dashboard";
import Notifications from "@/pages/dashboard/Notifications";
import MemberManagement from "@/pages/dashboard/MemberManagement";
import InviteMembers from "@/pages/dashboard/InviteMembers";
import OrganizationCollaboration from "@/pages/dashboard/OrganizationCollaboration";
import Subscription from "@/pages/dashboard/Subscription";
import OrganizationSettings from "@/pages/dashboard/OrganizationSettings";
import ProfileSettings from "@/pages/settings/ProfileSettings";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsLayout from "@/components/layout/SettingsLayout";
import FinanceLayout from "@/components/layout/FinanceLayout";
import OperationsLayout from "@/components/layout/OperationsLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AuthLayout from "@/components/layout/AuthLayout";
import MagicLinkJoin from "./pages/auth/MagicLinkJoin";
import CatatanMeetings from "@/pages/CatatanMeetings";
// Import Finance Pages
import FinanceDashboard from "@/pages/finance/Dashboard";
import Expenses from "@/pages/finance/Expenses";
import ExpenseBudget from "@/pages/finance/ExpenseBudget"; 
import ExpenseBudgetForecast from "@/pages/finance/ExpenseBudgetForecast"; 
import IncomeTarget from "@/pages/finance/IncomeTarget";
import ReminderBills from "@/pages/finance/ReminderBills";
import PayrollSummary from "@/pages/finance/PayrollSummary";
import CashManagement from "@/pages/finance/CashManagement";
import DaftarTransaksi from "@/pages/finance/DaftarTransaksi";
import BillApprovals from "@/pages/finance/BillApprovals";
// Import Operations Pages
import OperationsDashboard from "@/pages/operations/Dashboard";
import CustomerServicePage from "@/pages/operations/CustomerService";
import SalesPage from "@/pages/operations/Sales";
import LogisticsPage from "@/pages/operations/Logistics";
// Import Marketing Pages
import MarketingLayout from "@/components/layout/MarketingLayout";
import AdsPerformance from "@/pages/marketing/AdsPerformance";
import SocialMediaManagement from "@/pages/marketing/SocialMediaManagement";
import KolManagement from "@/pages/marketing/KolManagement";
import SeoManagement from "@/pages/marketing/SeoManagement";
import RatingPerformance from "@/pages/marketing/RatingPerformance";
import AgencyComparison from "@/pages/marketing/AgencyComparison";
import { useEffect } from "react";

function App() {
  // Check if the app is running in a development environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log the environment status to the console
  useEffect(() => {
    console.log(`App is running in ${isDevelopment ? 'development' : 'production'} mode.`);
    
    // Handle domain mismatch - redirect if on app.profitloop.id in development
    if (window.location.hostname === 'app.profitloop.id' && isDevelopment) {
      window.location.href = `http://localhost:5173${window.location.pathname}${window.location.search}`;
    }

    // Improve scrolling performance
    document.documentElement.classList.add('antialiased');
    document.documentElement.classList.add('smooth-scrolling');

    // Add CSS to improve transitions
    const style = document.createElement('style');
    style.textContent = `
      .smooth-scrolling {
        scroll-behavior: smooth;
      }
      .antialiased * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      a, button {
        transition: all 0.2s ease;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isDevelopment]);

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Routes>
          {/* Root redirects to login */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verification-sent" element={<VerificationSent />} />
          </Route>
          
          {/* Accept Invitations */}
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          <Route path="/join-organization" element={<MagicLinkJoin />} />

          {/* Protected Routes */}
          <Route path="/onboarding" element={<OrganizationSetup />} />
          <Route path="/employee-welcome" element={<EmployeeWelcome />} />

          {/* Dashboard Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
            {/* Redirect any unknown dashboard routes to main dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Catatan Meetings Route */}
          <Route
            path="/catatan-meetings"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CatatanMeetings />} />
          </Route>

          {/* Finance Routes */}
          <Route
            path="/finance"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FinanceLayout>
                    <Outlet />
                  </FinanceLayout>
                </DashboardLayout>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<FinanceDashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="expenses/budget" element={<ExpenseBudget />} />
            <Route path="expenses/budget/forecast" element={<ExpenseBudgetForecast />} />
            <Route path="income-target" element={<IncomeTarget />} />
            <Route path="reminder-bills" element={<ReminderBills />} />
            <Route path="reminder-bills/approvals" element={<BillApprovals />} />
            <Route path="payroll-summary" element={<PayrollSummary />} />
            <Route path="cash-management" element={<CashManagement />} />
            <Route path="cash-management/daftar-transaksi" element={<DaftarTransaksi />} />
            {/* Redirect to dashboard if no path matches */}
            <Route path="" element={<Navigate to="/finance/dashboard" replace />} />
          </Route>

          {/* Operations Routes - New section */}
          <Route
            path="/operations"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <OperationsLayout>
                    <Outlet />
                  </OperationsLayout>
                </DashboardLayout>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<OperationsDashboard />} />
            <Route path="customer-service" element={<CustomerServicePage />} />
            <Route path="customer-service/tickets" element={<CustomerServicePage />} />
            <Route path="customer-service/kanban" element={<CustomerServicePage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="logistics" element={<LogisticsPage />} />
            {/* Redirect to dashboard if no path matches */}
            <Route path="" element={<Navigate to="/operations/dashboard" replace />} />
          </Route>
          
          {/* Marketing Routes - New section */}
          <Route
            path="/marketing"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MarketingLayout>
                    <Outlet />
                  </MarketingLayout>
                </DashboardLayout>
              </ProtectedRoute>
            }
          >
            <Route path="ads-performance" element={<AdsPerformance />} />
            <Route path="social-media" element={<SocialMediaManagement />} />
            <Route path="kol" element={<KolManagement />} />
            <Route path="seo" element={<SeoManagement />} />
            <Route path="ratings" element={<RatingPerformance />} />
            <Route path="agency-comparison" element={<AgencyComparison />} />
            {/* Redirect to ads performance if no path matches */}
            <Route path="" element={<Navigate to="/marketing/ads-performance" replace />} />
          </Route>

          {/* Settings Layout */}
          <Route
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

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
