
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { routes } from '@/routes';
import { useOrganization } from '@/hooks/useOrganization';
import TrialBanner from '@/components/TrialBanner';
import { checkAndUpdateTrialStatus } from '@/services/subscriptionService';
import '@/css/trial-styles.css';

// Create the router using routes definition
const router = createBrowserRouter(routes);

// Location observer component to determine when to show trial banner
function TrialBannerWrapper() {
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
  
  if (!isAuthPage) {
    return <TrialBanner />;
  }
  
  return null;
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster position="top-right" expand={true} closeButton richColors />
    </ThemeProvider>
  );
}

export default App;
