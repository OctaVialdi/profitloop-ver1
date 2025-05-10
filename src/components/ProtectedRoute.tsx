
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { subscriptionService } from "@/services/subscriptionService";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  allowOnTrial?: boolean;
  requirePaidSubscription?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  allowOnTrial = true,
  requirePaidSubscription = false,
}: ProtectedRouteProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, organization, isLoading: orgLoading, isTrialActive, hasPaidSubscription } = useOrganization();
  const location = useLocation();
  
  // Check and update trial status when mounting protected routes
  useEffect(() => {
    const updateTrialStatus = async () => {
      if (organization?.id) {
        try {
          await subscriptionService.checkAndUpdateTrialStatus(organization.id);
        } catch (error) {
          console.error("Error checking trial status:", error);
        }
      }
    };
    
    updateTrialStatus();
  }, [organization?.id]);
  
  // Show loading state when auth state is still being determined
  if (authLoading || (requireAuth && user && orgLoading)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  // Check admin requirement
  if (requireAuth && requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check subscription requirement
  if (requireAuth && requirePaidSubscription && !hasPaidSubscription) {
    if (allowOnTrial && isTrialActive) {
      // Allow if on trial and trials are allowed
      return <>{children}</>;
    }
    
    // Redirect to subscription page if paid subscription required
    return <Navigate to="/settings/subscription" replace />;
  }
  
  // If all checks pass, render the protected content
  return <>{children}</>;
}
