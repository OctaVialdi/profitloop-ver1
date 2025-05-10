
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from '@/components/QueryProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

// Routes
import { authRoutes } from '@/routes/authRoutes';
import { dashboardRoutes } from '@/routes/dashboardRoutes';
import { settingsRoutes } from '@/routes/settingsRoutes';
import { onboardingRoutes } from '@/routes/onboardingRoutes';
import { subscriptionRoutes } from '@/routes/subscriptionRoutes';

// Global components 
import { NotificationSystem } from '@/components/NotificationSystem';

// Public pages
import WelcomePage from '@/pages/WelcomePage';
import LandingPage from '@/pages/LandingPage';
import PublicApplicationForm from '@/pages/public/ApplicationForm'; 
import PublicJobPreview from '@/pages/public/JobPreview';
import NotFoundPage from '@/pages/NotFoundPage';

import './App.css';
import './css/trial-styles.css';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <Router>
          <Routes>
            {/* Auth Routes */}
            {authRoutes}
            
            {/* Dashboard Routes */}
            {dashboardRoutes}
            
            {/* Settings Routes */}
            {settingsRoutes}
            
            {/* Onboarding Routes */}
            {onboardingRoutes}
            
            {/* Subscription Routes */}
            {subscriptionRoutes}
            
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/application/:linkId" element={<PublicApplicationForm />} />
            <Route path="/job/:linkId" element={<PublicJobPreview />} />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          {/* Global components */}
          <NotificationSystem />
          <Toaster position="top-right" />
        </Router>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
