
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
          const { data: profileData } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', data.session.user.id)
            .maybeSingle();
            
          setHasOrganization(!!profileData?.organization_id);
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

  // Always redirect unauthenticated users to login page
  if (!authenticated && !isPublicRoute) {
    console.log("Not authenticated, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is not on employee-welcome and not on auth pages
  if (authenticated && !hasOrganization && 
      currentPath !== '/employee-welcome' &&
      !currentPath.startsWith('/auth/')) {
    return <Navigate to="/employee-welcome" replace />;
  }

  return <>{children}</>;
};
