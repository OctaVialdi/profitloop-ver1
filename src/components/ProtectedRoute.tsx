
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/auth/login"
}: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthenticated(!!session);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    // You could add a loading spinner here
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  // Jika berada di app.profitloop.id, sebaiknya tidak redirect ke login
  // karena mungkin ini adalah permasalahan domain dan bukan autentikasi
  if (!authenticated) {
    // Handle app.profitloop.id domain specially
    if (window.location.hostname === 'app.profitloop.id') {
      console.log("Detected app.profitloop.id domain. Not redirecting to login.");
      // Instead of redirecting, we'll show a simple message
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
          <h2 className="text-2xl font-bold mb-4">Domain Error</h2>
          <p className="mb-4 text-center max-w-md">
            app.profitloop.id domain is not configured correctly. 
            Please contact the administrator.
          </p>
        </div>
      );
    }
    
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};
