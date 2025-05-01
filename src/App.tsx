
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/ThemeProvider'

// Layouts
import AuthLayout from '@/components/layout/AuthLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import SettingsLayout from '@/components/layout/SettingsLayout'

// Pages
import Index from '@/pages/Index'
import Dashboard from '@/pages/dashboard/Dashboard'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import VerificationSent from '@/pages/auth/VerificationSent'
import NotFound from '@/pages/NotFound'
import WelcomePage from '@/pages/WelcomePage'
import Notifications from '@/pages/dashboard/Notifications'
import OrganizationSettings from '@/pages/dashboard/OrganizationSettings'
import OrganizationCollaboration from '@/pages/dashboard/OrganizationCollaboration'
import Subscription from '@/pages/dashboard/Subscription'
import ProfileSettings from '@/pages/settings/ProfileSettings'
import OrganizationSetup from '@/pages/onboarding/OrganizationSetup'
import EmployeeWelcome from '@/pages/employee/EmployeeWelcome'
import InviteMembers from '@/pages/dashboard/InviteMembers'
import MemberManagement from '@/pages/dashboard/MemberManagement'
import MagicInvite from '@/pages/dashboard/MagicInvite'
import AcceptInvitation from '@/pages/auth/AcceptInvitation'
import AcceptMagicInvitation from '@/pages/auth/AcceptMagicInvitation'

import './App.css'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/employee-welcome" element={<EmployeeWelcome />} />
          <Route path="/onboarding" element={<OrganizationSetup />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          <Route path="/accept-magic-invitation" element={<AcceptMagicInvitation />} />
          
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/verification-sent" element={<VerificationSent />} />
          </Route>
          
          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/invite" element={<InviteMembers />} />
            <Route path="/magic-invite" element={<MagicInvite />} />
            <Route path="/members" element={<MemberManagement />} />
            <Route path="/organization-settings" element={<OrganizationSettings />} />
            <Route path="/collaborations" element={<OrganizationCollaboration />} />
            <Route path="/subscription" element={<Subscription />} />
            
            {/* Settings routes */}
            <Route path="/settings/profile" element={<ProfileSettings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
