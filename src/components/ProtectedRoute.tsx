
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  publicRoutes?: string[];
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/auth/login",
  publicRoutes = ["/join-organization", "/accept-invitation"]
}: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [hasOrganization, setHasOrganization] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if current path is in public routes
  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

  useEffect(() => {
    // Skip authentication check for public routes
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        // First get the current session directly
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("User is authenticated via session check");
          setAuthenticated(true);
          
          // Check if user has an organization
          if (currentPath === '/onboarding') {
            // If already on onboarding page, don't redirect
            setHasOrganization(false);
          } else {
            // Check if user has an organization
            const { data: profileData } = await supabase
              .from('profiles')
              .select('organization_id')
              .eq('id', data.session.user.id)
              .maybeSingle();
              
            setHasOrganization(!!profileData?.organization_id);
          }
        } else {
          console.log("No active session found");
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setAuthenticated(!!session);
        setLoading(false);
      }
    );

    // Check for an existing session
    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [isPublicRoute, currentPath]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  // If user is trying to access onboarding but already has organization, redirect to dashboard
  if (authenticated && currentPath === '/onboarding' && hasOrganization) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated but doesn't have organization and not already on onboarding page,
  // redirect to onboarding (but only if not on specific pages)
  if (authenticated && !hasOrganization && 
      currentPath !== '/onboarding' && 
      currentPath !== '/employee-welcome' &&
      !currentPath.startsWith('/auth/')) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!authenticated && !isPublicRoute) {
    console.log("Not authenticated, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
