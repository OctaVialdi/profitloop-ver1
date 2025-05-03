
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface ProtectedRouteProps {
  children?: ReactNode;
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

    let isMounted = true;
    const checkAuth = async () => {
      try {
        // First get the current session directly
        const { data } = await supabase.auth.getSession();
        
        if (data.session && isMounted) {
          console.log("User is authenticated via session check");
          setAuthenticated(true);
        } else if (isMounted) {
          console.log("No active session found");
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (isMounted) {
          setAuthenticated(false);
          // Show friendly error message
          toast.error("Terjadi kesalahan saat memeriksa autentikasi");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Check for an existing session once
    checkAuth();

    // Set up auth state change listener with a more limited scope
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        // Only update on meaningful auth events
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          console.log("Auth state changed:", event);
          setAuthenticated(!!session);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isPublicRoute]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authenticated && !isPublicRoute) {
    console.log("Not authenticated, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
