
import { useNavigate as useRouterNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

/**
 * Hook for handling navigation related to organization setup flow
 */
export const useOrganizationNavigation = () => {
  // This will throw an error if used outside of Router context
  // Create a safe navigation handler that falls back to window.location
  let navigate;
  
  try {
    navigate = useRouterNavigate();
  } catch (error) {
    console.warn('Navigation attempted outside Router context');
    // Provide a fallback function when outside Router context
    navigate = (path: string) => {
      console.warn('Navigation attempted outside Router context:', path);
      window.location.href = path;
    };
  }
  
  const redirectToLogin = (message?: string) => {
    if (message) {
      toast.error(message);
    }
    if (typeof navigate === 'function') {
      navigate("/auth/login", { replace: true });
    } else {
      window.location.href = "/auth/login";
    }
  };

  const redirectToEmployeeWelcome = () => {
    if (typeof navigate === 'function') {
      navigate("/employee-welcome", { replace: true });
    } else {
      window.location.href = "/employee-welcome";
    }
  };

  return {
    redirectToLogin,
    redirectToEmployeeWelcome,
    navigate
  };
};
