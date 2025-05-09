
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { hrRoutes } from "./hrRoutes";
import { itRoutes } from "./itRoutes";
import { onboardingRoutes } from "./onboardingRoutes";
import { settingsRoutes } from "./settingsRoutes";
import { myInfoRoutes } from "./myInfoRoutes";
import { marketingRoutes } from "./marketingRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { financeRoutes, paymentRoutes } from "./financeRoutes";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import { Outlet } from "react-router-dom";
import TrialBanner from "@/components/TrialBanner";
import { useEffect } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { checkAndUpdateTrialStatus } from "@/services/subscriptionService";
import { trackSubscriptionEvent } from "@/utils/subscriptionUtils";

// Root layout component that includes trial-related functionality
const RootLayout = () => {
  const { isTrialActive, organization } = useOrganization();
  
  // Force check trial status on app load
  useEffect(() => {
    const updateTrialStatus = async () => {
      if (organization?.id) {
        await checkAndUpdateTrialStatus(organization.id);
      }
    };
    
    updateTrialStatus();
  }, [organization?.id]);
  
  // Track app session start for analytics
  useEffect(() => {
    const trackSession = async () => {
      if (organization?.id) {
        await trackSubscriptionEvent('app_session_start', organization.id, {
          trial_active: isTrialActive,
          subscription_status: organization.subscription_status
        });
      }
    };
    
    trackSession();
    
    return () => {
      // Track session end on unmount
      if (organization?.id) {
        trackSubscriptionEvent('app_session_end', organization.id);
      }
    };
  }, [organization?.id, isTrialActive, organization?.subscription_status]);
  
  // Add or remove trial-expired class based on trial status
  useEffect(() => {
    if (organization?.trial_expired && organization?.subscription_status === 'expired') {
      document.body.classList.add('trial-expired');
    } else {
      document.body.classList.remove('trial-expired');
    }
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('trial-expired');
    };
  }, [organization?.trial_expired, organization?.subscription_status]);
  
  return (
    <>
      <TrialBanner />
      <Outlet />
    </>
  );
};

// Application Routes
const applicationRoutes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
];

// Convert element routes to RouteObject format
const convertToRouteObjects = (routes: any): RouteObject[] => {
  if (Array.isArray(routes)) {
    return routes.map(route => convertToRouteObjects(route)).flat();
  }
  return [routes];
};

// Create the router with all routes
const router = createBrowserRouter([
  ...applicationRoutes,
  ...convertToRouteObjects(authRoutes),
  ...convertToRouteObjects(dashboardRoutes),
  ...convertToRouteObjects(hrRoutes),
  ...convertToRouteObjects(financeRoutes),
  ...convertToRouteObjects(marketingRoutes),
  ...convertToRouteObjects(operationsRoutes),
  ...convertToRouteObjects(itRoutes),
  ...convertToRouteObjects(myInfoRoutes),
  ...convertToRouteObjects(settingsRoutes),
  ...convertToRouteObjects(onboardingRoutes),
  ...convertToRouteObjects(paymentRoutes)
]);

export default router;
