
import { useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface TrialProtectionProps {
  children: ReactNode;
}

const TrialProtection = ({ children }: TrialProtectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trialExpired, setTrialExpired] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Paths that should always be accessible, even with expired trial
  const allowedPaths = [
    "/auth",
    "/subscription",
    "/profile",
  ];
  
  // Paths that need authentication but are not under trial protection
  const authPaths = [
    "/onboarding",
    "/employee-welcome"
  ];
  
  const isPathAllowed = () => {
    return allowedPaths.some(path => location.pathname.startsWith(path));
  };
  
  const isAuthPath = () => {
    return authPaths.some(path => location.pathname === path);
  };
  
  useEffect(() => {
    const checkTrialStatus = async () => {
      // Skip check on auth paths
      if (location.pathname.startsWith('/auth/')) {
        setIsLoading(false);
        return;
      }
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        // Not logged in, redirect to login page
        setIsAuthenticated(false);
        setIsLoading(false);
        
        // Only redirect if not already on an allowed path
        if (!isPathAllowed() && !location.pathname.startsWith('/auth/')) {
          console.log("User not authenticated, redirecting to login");
          navigate("/auth/login", { replace: true });
        }
        return;
      }
      
      setIsAuthenticated(true);
      
      // If on auth path but authenticated, handle separately (e.g., onboarding)
      if (isAuthPath()) {
        setIsLoading(false);
        return;
      }
      
      // Skip on other allowed paths
      if (isPathAllowed()) {
        setIsLoading(false);
        return;
      }
      
      // Get current user organization
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (!profileData?.organization_id) {
        // No organization, redirect to onboarding
        console.log("User has no organization, redirecting to onboarding");
        setIsLoading(false);
        navigate("/onboarding", { replace: true });
        return;
      }
      
      // Check organization trial status
      const { data: orgData } = await supabase
        .from('organizations')
        .select('trial_expired, subscription_plan_id, trial_end_date')
        .eq('id', profileData.organization_id)
        .single();
      
      // If trial is expired and no active subscription, redirect to subscription page
      if (orgData?.trial_expired && !orgData?.subscription_plan_id) {
        setTrialExpired(true);
        if (!isPathAllowed()) {
          navigate("/subscription", { replace: true });
        }
      }
      
      setIsLoading(false);
    };
    
    checkTrialStatus();
  }, [location.pathname, navigate]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If not authenticated and not on an allowed path, don't render children
  if (!isAuthenticated && !isPathAllowed() && !location.pathname.startsWith('/auth/')) {
    return null;
  }
  
  return <>{children}</>;
};

export default TrialProtection;
