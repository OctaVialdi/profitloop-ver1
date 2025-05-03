
import { useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface TrialProtectionProps {
  children: ReactNode;
}

const TrialProtection = ({ children }: TrialProtectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trialExpired, setTrialExpired] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Paths that should always be accessible, even with expired trial
  const allowedPaths = [
    "/auth",
    "/subscription",
    "/profile",
  ];
  
  const isPathAllowed = () => {
    return allowedPaths.some(path => location.pathname.startsWith(path));
  };
  
  useEffect(() => {
    const checkTrialStatus = async () => {
      // Skip on allowed paths
      if (isPathAllowed()) {
        setIsLoading(false);
        return;
      }
      
      // Get current user organization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        // Not logged in, will be handled by auth protection
        setIsLoading(false);
        return;
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (!profileData?.organization_id) {
        // No organization, will be redirected to onboarding
        setIsLoading(false);
        return;
      }
      
      // Check organization trial status
      const { data: orgData } = await supabase
        .from('organizations')
        .select('trial_expired, subscription_plan_id')
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
    return <div>Loading...</div>;
  }
  
  return <>{children}</>;
};

export default TrialProtection;
