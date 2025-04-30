
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";

// Pages
import { NotFound } from '@/pages/NotFound';
import WelcomePage from '@/pages/WelcomePage';
import Dashboard from '@/pages/dashboard/Dashboard';
import OrganizationSetup from '@/pages/onboarding/OrganizationSetup';
import Subscription from '@/pages/dashboard/Subscription';
import MemberManagement from '@/pages/dashboard/MemberManagement';
import InviteMembers from '@/pages/dashboard/InviteMembers';
import OrganizationCollaboration from '@/pages/dashboard/OrganizationCollaboration';
import NotificationPage from '@/pages/dashboard/Notifications';

// Auth pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import VerificationSent from '@/pages/auth/VerificationSent';
import AcceptInvitation from '@/pages/auth/AcceptInvitation';

// Layouts
import AuthLayout from '@/components/layout/AuthLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verification-sent" element={<VerificationSent />} />
          <Route path="/auth/accept-invitation" element={<AcceptInvitation />} />
        </Route>
        
        {/* Onboarding */}
        <Route path="/onboarding" element={<OrganizationSetup />} />
        
        {/* Welcome page */}
        <Route path="/welcome" element={<WelcomePage />} />
        
        {/* Dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/members" element={<MemberManagement />} />
          <Route path="/invite" element={<InviteMembers />} />
          <Route path="/collaborations" element={<OrganizationCollaboration />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
