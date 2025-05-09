
import { useEffect } from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { routes as appRoutes } from '@/routes';
import { useOrganization } from '@/hooks/useOrganization';
import TrialBanner from '@/components/TrialBanner';
import { checkAndUpdateTrialStatus } from '@/services/subscriptionService';
import '@/css/trial-styles.css';

function App() {
  const { organization } = useOrganization();
  const location = useLocation();
  
  // Check trial status on app load
  useEffect(() => {
    const checkTrialStatus = async () => {
      if (organization?.id) {
        await checkAndUpdateTrialStatus(organization.id);
      }
    };
    
    checkTrialStatus();
  }, [organization?.id]);
  
  // Don't show trial banner on auth pages
  const isAuthPage = location.pathname.startsWith('/auth/');
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {!isAuthPage && <TrialBanner />}
      <Routes>{appRoutes}</Routes>
      <Toaster position="top-right" expand={true} closeButton richColors />
    </ThemeProvider>
  );
}

export default App;
