import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string;
  publicRoutes?: string[];
}

interface ProfileData {
  organization_id?: string | null;
  email_verified?: boolean;
  has_seen_welcome?: boolean;
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/auth/login",
  publicRoutes = ["/join-organization", "/accept-invitation"]
}: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if current path is in public routes
  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
  const isAuthRoute = currentPath.startsWith('/auth/'); // ALL auth routes are public

  useEffect(() => {
    console.log("ProtectedRoute: checking path", currentPath);
    console.log("Is public route?", isPublicRoute);
    console.log("Is auth route?", isAuthRoute);
    
    // Skip authentication check for auth and public routes
    if (isPublicRoute || isAuthRoute) {
      console.log("Skipping auth check for public/auth route");
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
          
          // Extract organization info from user metadata if possible (most reliable source)
          if (session.user.user_metadata?.organization_id) {
            const emailVerified = session.user.email_confirmed_at !== null;
            
            // If we have metadata, use it directly
            setProfile({
              organization_id: session.user.user_metadata.organization_id,
              email_verified: emailVerified,
              has_seen_welcome: session.user.user_metadata.has_seen_welcome || false
            });
            
            setLoading(false);
            return;
          }
          
          // Otherwise, try to use the RPC function
          try {
            const { data: profileData, error: profileError } = await supabase
              .rpc('check_user_has_organization', {
                user_id: session.user.id
              });
              
            if (profileError) {
              console.error("Error using check_user_has_organization:", profileError);
              
              // If we hit an RLS error, use a simpler direct query as fallback
              if (profileError.message.includes("infinite recursion")) {
                // Fallback to assuming verified but no organization for now
                if (isMounted) {
                  setProfile({
                    email_verified: true,
                    organization_id: null,
                    has_seen_welcome: false
                  });
                }
              }
            } else if (profileData && profileData.length > 0) {
              // The function returns an array, use the first result
              if (isMounted) {
                setProfile(profileData[0]);
              }
            } else {
              // No profile data found
              if (isMounted) {
                setProfile({
                  email_verified: true, // Assume verified if authenticated
                  organization_id: null,
                  has_seen_welcome: false
                });
              }
            }
          } catch (error) {
            console.error("Error checking profile:", error);
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
          
          // If signed in, update profile info
          if (session) {
            // Extract from metadata if available
            if (session.user.user_metadata?.organization_id) {
              const emailVerified = session.user.email_confirmed_at !== null;
              
              setProfile({
                organization_id: session.user.user_metadata.organization_id,
                email_verified: emailVerified,
                has_seen_welcome: session.user.user_metadata.has_seen_welcome || false
              });
              
              setLoading(false);
              return;
            }
            
            // Otherwise, use setTimeout to prevent potential auth state deadlocks
            setTimeout(async () => {
              if (!isMounted) return;
              
              try {
                const { data: profileData, error: profileError } = await supabase
                  .rpc('check_user_has_organization', {
                    user_id: session.user.id
                  });
                  
                if (isMounted) {
                  if (!profileError && profileData && profileData.length > 0) {
                    setProfile(profileData[0]);
                  } else {
                    // Default to assuming verified but no organization
                    setProfile({
                      email_verified: true,
                      organization_id: null,
                      has_seen_welcome: false
                    });
                  }
                  setLoading(false);
                }
              } catch (error) {
                console.error("Error checking profile in auth change:", error);
                // Provide default values to avoid UI being stuck
                if (isMounted) {
                  setProfile({
                    email_verified: true,
                    organization_id: null,
                    has_seen_welcome: false
                  });
                  setLoading(false);
                }
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
  }, [isPublicRoute, isAuthRoute, currentPath]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  // Authentication routes handling (login, register)
  if (isAuthRoute) {
    console.log("Rendering auth route:", currentPath);
    // IMPORTANT: Auth routes are ALWAYS allowed, even if already authenticated
    // This ensures registration and login pages are always accessible
    return children ? <>{children}</> : <Outlet />;
  }

  // Handle specific redirections based on the flowchart
  if (authenticated) {
    // Check if email is verified for non-auth pages
    if (profile && !profile.email_verified && !isPublicRoute) {
      toast.error("Email Anda belum diverifikasi. Silakan verifikasi email terlebih dahulu.");
      return <Navigate to="/auth/login" state={{ from: location, requireVerification: true }} replace />;
    }
    
    // Add specific exemption for subscription page when trial has expired
    if (currentPath === '/subscription') {
      // Always allow access to the subscription page even if trial expired
      // Add a class to the body to exempt this page from the blur effect
      document.body.classList.add('subscription-page');
      // Make sure to return and render the children
      return children ? <>{children}</> : <Outlet />;
    } else {
      // Remove the class when not on the subscription page
      document.body.classList.remove('subscription-page');
    }
    
    // Specific route handling for organizations page
    if (currentPath.startsWith('/organizations') || currentPath === '/onboarding') {
      // If already has organization, redirect to welcome page if not seen
      if (profile && profile.organization_id) {
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
      if (profile && !profile.organization_id) {
        return <Navigate to="/organizations" state={{ from: location }} replace />;
      }
      // If already seen welcome page, go to dashboard
      if (profile && profile.has_seen_welcome) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
      }
    }
    
    // Check if on dashboard or other protected pages
    if (currentPath.startsWith('/dashboard') || 
        currentPath.startsWith('/hr/') ||
        currentPath.startsWith('/finance/')) {
      // If no organization, redirect to organization setup
      if (profile && !profile.organization_id) {
        return <Navigate to="/organizations" state={{ from: location }} replace />;
      }
      // If hasn't seen welcome page, redirect there first
      if (profile && !profile.has_seen_welcome) {
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
