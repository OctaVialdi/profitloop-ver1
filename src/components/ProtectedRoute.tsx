
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
  const [profile, setProfile] = useState<{
    organization_id?: string | null;
    email_verified?: boolean;
    has_seen_welcome?: boolean;
  } | null>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if current path is in public routes
  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
  const isAuthRoute = currentPath.startsWith('/auth/');

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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && isMounted) {
          console.log("User is authenticated via session check");
          setAuthenticated(true);
          
          // Get user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('organization_id, email_verified, has_seen_welcome')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else {
            setProfile(profileData);
          }
        } else if (isMounted) {
          console.log("No active session found");
          setAuthenticated(false);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (isMounted) {
          setAuthenticated(false);
          setProfile(null);
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

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        // Only update on meaningful auth events
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          console.log("Auth state changed:", event);
          setAuthenticated(!!session);
          
          // If signed in, check profile
          if (session) {
            // Use setTimeout to prevent potential auth state deadlocks
            setTimeout(async () => {
              if (!isMounted) return;
              
              const { data: profileData } = await supabase
                .from('profiles')
                .select('organization_id, email_verified, has_seen_welcome')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (isMounted) {
                setProfile(profileData);
                setLoading(false);
              }
            }, 0);
          } else {
            setProfile(null);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      // Clean up subscription
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

  // Authentication routes handling (login, register)
  if (isAuthRoute) {
    // If already authenticated, redirect based on profile status
    if (authenticated) {
      // Check email verification first
      if (!profile?.email_verified) {
        // If on login page already, no need to redirect
        return children ? <>{children}</> : <Outlet />;
      }
      
      // Check organization status
      if (profile?.organization_id) {
        // Check if has seen welcome page
        if (!profile.has_seen_welcome) {
          return <Navigate to="/employee-welcome" state={{ from: location }} replace />;
        } else {
          return <Navigate to="/dashboard" state={{ from: location }} replace />;
        }
      } else {
        return <Navigate to="/organizations" state={{ from: location }} replace />;
      }
    }
    
    // Not authenticated and on auth route, show the auth page
    return children ? <>{children}</> : <Outlet />;
  }

  // Handle specific redirections based on the flowchart
  if (authenticated) {
    // Check if email is verified for non-auth pages
    if (!profile?.email_verified && !isPublicRoute) {
      toast.error("Email Anda belum diverifikasi. Silakan verifikasi email terlebih dahulu.");
      return <Navigate to="/auth/login" state={{ from: location, requireVerification: true }} replace />;
    }
    
    // Specific route handling for organizations page
    if (currentPath.startsWith('/organizations') || currentPath === '/onboarding') {
      // If already has organization, redirect to welcome page if not seen
      if (profile?.organization_id) {
        if (!profile.has_seen_welcome) {
          return <Navigate to="/employee-welcome" state={{ from: location }} replace />;
        } else {
          return <Navigate to="/dashboard" state={{ from: location }} replace />;
        }
      }
    }
    
    // Check if on employee welcome page
    if (currentPath === '/employee-welcome') {
      // If no organization, redirect to organization setup
      if (!profile?.organization_id) {
        return <Navigate to="/organizations" state={{ from: location }} replace />;
      }
      // If already seen welcome page, go to dashboard
      if (profile.has_seen_welcome) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
      }
    }
    
    // Check if on dashboard or other protected pages
    if (currentPath.startsWith('/dashboard') || 
        currentPath.startsWith('/hr/') ||
        currentPath.startsWith('/finance/')) {
      // If no organization, redirect to organization setup
      if (!profile?.organization_id) {
        return <Navigate to="/organizations" state={{ from: location }} replace />;
      }
      // If hasn't seen welcome page, redirect there first
      if (!profile.has_seen_welcome) {
        return <Navigate to="/employee-welcome" state={{ from: location }} replace />;
      }
    }
    
    // User is authenticated and passed all checks, render children
    return children ? <>{children}</> : <Outlet />;
  }

  // If not authenticated and not on a public route, redirect to login
  if (!authenticated && !isPublicRoute) {
    console.log("Not authenticated, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
