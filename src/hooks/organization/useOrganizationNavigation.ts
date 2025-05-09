
import { useNavigate as useRouterNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

/**
 * Hook for handling navigation related to organization setup flow
 */
export const useOrganizationNavigation = () => {
  // This will throw an error if used outside of Router context
  // We'll handle this by ensuring this hook is only used within Router components
  let navigate;
  
  try {
    navigate = useRouterNavigate();
  } catch (error) {
    // Provide a fallback function when outside Router context
    navigate = (path: string) => {
      console.warn('Navigation attempted outside Router context:', path);
      // We could redirect using window.location as a fallback
      // but that would cause a full page reload
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
