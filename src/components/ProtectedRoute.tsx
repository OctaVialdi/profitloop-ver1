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
          console.log("User is authenticated:", data.session.user.id);
          setAuthenticated(true);
          
          // Check if user has an organization
          const { data: profileData } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', data.session.user.id)
            .maybeSingle();
            
          if (profileData?.organization_id) {
            console.log("User already has an organization:", profileData.organization_id);
            setHasOrganization(true);
          } else {
            console.log("User has no organization");
            setHasOrganization(false);
          }
        } else {
          console.log("No active session found");
          setAuthenticated(false);
          setHasOrganization(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthenticated(false);
        setHasOrganization(false);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setAuthenticated(!!session);
        
        // When auth state changes, also check for organization
        if (session) {
          const checkOrganization = async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('organization_id')
              .eq('id', session.user.id)
              .maybeSingle();
              
            setHasOrganization(!!profileData?.organization_id);
          };
          
          checkOrganization();
        } else {
          setHasOrganization(false);
        }
        
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

  // If user is authenticated, has no organization, and is NOT on the organizations page
  // redirect them to the organizations page
  if (authenticated && !hasOrganization && currentPath !== '/organizations') {
    console.log("User has no organization, redirecting to organizations page");
    return <Navigate to="/organizations" replace />;
  }
  
  // If user is authenticated, has an organization, and IS on the organizations page
  // redirect them to the employee welcome page or dashboard
  if (authenticated && hasOrganization && currentPath === '/organizations') {
    console.log("User already has an organization, redirecting to employee welcome");
    return <Navigate to="/employee-welcome" replace />;
  }

  // Otherwise, render children
  return <>{children}</>;
};

export default ProtectedRoute;
