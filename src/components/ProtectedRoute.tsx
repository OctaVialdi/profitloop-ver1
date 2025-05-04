
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
  const [hasProfile, setHasProfile] = useState(false);
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
    let realtimeSubscription: { unsubscribe: () => void } | null = null;
    
    const checkAuth = async () => {
      try {
        // First get the current session directly
        const { data } = await supabase.auth.getSession();
        
        if (data.session && isMounted) {
          console.log("User is authenticated via session check");
          setAuthenticated(true);
          
          // Check for profile record
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }
          
          // If user has a profile, set hasProfile to true
          setHasProfile(!!profileData);
          
          // If no profile, create one - preserve their role if in metadata
          if (!profileData) {
            const role = data.session.user.user_metadata?.role || 'employee';
            
            try {
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: data.session.user.id,
                  email: data.session.user.email,
                  full_name: data.session.user.user_metadata?.full_name || null,
                  role: role // Use role from metadata or default
                });
                
              if (insertError) {
                console.error("Error creating profile:", insertError);
              } else {
                console.log("Profile created during protected route check with role:", role);
                setHasProfile(true);
              }
            } catch (err) {
              console.error("Failed to create profile:", err);
            }
          }
        } else if (isMounted) {
          console.log("No active session found");
          setAuthenticated(false);
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (isMounted) {
          setAuthenticated(false);
          setHasProfile(false);
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
          
          // Reset loading when auth state changes to trigger a full recheck
          if (event === 'SIGNED_IN') {
            setLoading(true);
            setTimeout(() => {
              checkAuth();
            }, 300); // Small delay to allow auth state to settle
          } else {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      // Clean up subscriptions
      subscription.unsubscribe();
      
      // Clean up any realtime subscriptions
      if (realtimeSubscription) {
        realtimeSubscription.unsubscribe();
      }
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
