
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

/**
 * Hook for handling navigation related to organization setup flow
 */
export const useOrganizationNavigation = () => {
  const navigate = useNavigate();
  
  const redirectToLogin = (message?: string) => {
    if (message) {
      toast.error(message);
    }
    navigate("/auth/login", { replace: true });
  };

  const redirectToEmployeeWelcome = () => {
    navigate("/employee-welcome", { replace: true });
  };

  return {
    redirectToLogin,
    redirectToEmployeeWelcome,
    navigate
  };
};
