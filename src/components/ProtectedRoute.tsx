
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  publicRoutes?: string[];
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/auth/login",
  publicRoutes = ["/join-organization"]
}: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const currentPath = window.location.pathname;

  // Check if current path is in public routes
  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

  useEffect(() => {
    // Skip authentication check for public routes
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthenticated(!!session);
        setLoading(false);
      }
    );

    // Then check for an existing session
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
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
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};
