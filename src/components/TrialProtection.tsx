
import { useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface TrialProtectionProps {
  children: ReactNode;
}

const TrialProtection = ({ children }: TrialProtectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Paths that should always be accessible
  const allowedPaths = [
    "/auth",
    "/subscription",
    "/profile",
  ];
  
  // Paths that need authentication but are not under protection
  const authPaths = [
    "/organizations",
    "/employee-welcome"
  ];
  
  const isPathAllowed = () => {
    return allowedPaths.some(path => location.pathname.startsWith(path));
  };
  
  const isAuthPath = () => {
    return authPaths.some(path => location.pathname === path);
  };
  
  useEffect(() => {
    let isMounted = true;
    
    const checkAuthStatus = async () => {
      // Skip check on auth paths
      if (location.pathname.startsWith('/auth/')) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        // Not logged in, redirect to login page
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          
          // Only redirect if not already on an allowed path
          if (!isPathAllowed() && !location.pathname.startsWith('/auth/')) {
            console.log("User not authenticated, redirecting to login");
            navigate("/auth/login", { replace: true });
          }
        }
        return;
      }
      
      if (isMounted) {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
      
      // Get current user organization
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (!profileData?.organization_id && !isPathAllowed() && !isAuthPath()) {
        // No organization, redirect to organizations
        console.log("User has no organization, redirecting to organizations");
        if (isMounted) {
          navigate("/organizations", { replace: true });
        }
        return;
      }
    };
    
    checkAuthStatus();
    
    return () => {
      isMounted = false;
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
