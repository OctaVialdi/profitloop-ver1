
import { useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { checkAndUpdateTrialStatus } from "@/services/subscriptionService";

interface TrialProtectionProps {
  children: ReactNode;
}

const TrialProtection = ({ children }: TrialProtectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
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
    "/employee-welcome",
    "/organizations"
  ];
  
  const isPathAllowed = () => {
    return allowedPaths.some(path => location.pathname.startsWith(path));
  };
  
  const isAuthPath = () => {
    return authPaths.some(path => location.pathname.startsWith(path) || location.pathname === path);
  };
  
  useEffect(() => {
    const checkTrialStatus = async () => {
      // Skip check on auth paths
      if (location.pathname.startsWith('/auth/')) {
        setIsLoading(false);
        return;
      }
      
      try {
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
        
        // If on auth path but authenticated, handle separately
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
          // No organization, redirect to organizations
          console.log("User has no organization, redirecting to organizations page");
          setIsLoading(false);
          navigate("/organizations", { replace: true });
          return;
        }
        
        // Check organization trial status
        const { data: orgData } = await supabase
          .from('organizations')
          .select('trial_expired, subscription_plan_id, trial_end_date')
          .eq('id', profileData.organization_id)
          .single();
        
        if (!orgData) {
          setIsLoading(false);
          return;
        }
        
        // Check if trial has expired based on date comparison
        const trialEndDate = orgData?.trial_end_date ? new Date(orgData.trial_end_date) : null;
        const now = new Date();
        const isTrialExpiredByDate = trialEndDate && trialEndDate <= now;
        
        console.log("Trial status check:", {
          trialEndDate,
          currentDate: now,
          isTrialExpiredByDate,
          flagValue: orgData?.trial_expired
        });
        
        // If trial is expired (by date or by flag), but not on subscription page,
        // apply the blur effect
        if ((isTrialExpiredByDate || orgData?.trial_expired) && 
            !location.pathname.startsWith('/subscription')) {
          console.log("Trial expired, applying blur effect");
          document.body.classList.add('trial-expired');
          
          // Update trial_expired flag in database if needed
          if (isTrialExpiredByDate && !orgData?.trial_expired) {
            await checkAndUpdateTrialStatus(profileData.organization_id);
          }
        } else {
          // Remove blur effect if not expired or on subscription page
          document.body.classList.remove('trial-expired');
        }
      } catch (error) {
        console.error("Error checking trial status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTrialStatus();
    
    // Clean up when unmounting
    return () => {
      if (!isPathAllowed() && !location.pathname.startsWith('/subscription')) {
        document.body.classList.remove('trial-expired');
      }
    };
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
