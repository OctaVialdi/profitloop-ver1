
import { useLocation } from "react-router-dom";
import { useLoginFormState } from "./useLoginFormState";
import { useVerificationHandler } from "./useVerificationHandler";
import { useLoginSubmit } from "./useLoginSubmit";
import { useEmailVerification } from "./useEmailVerification";
import { useAuth } from "./useAuth";

export function useLoginForm() {
  const { email, setEmail, password, setPassword } = useLoginFormState();
  const { isEmailUnverified, setIsEmailUnverified, getAdditionalStateFromLocation } = useVerificationHandler();
  const { handleSubmit, isLoading, loginError } = useLoginSubmit();
  const { resendingVerification, resendVerificationEmail } = useEmailVerification();
  const { loginError: authLoginError } = useAuth();
  
  const location = useLocation();
  
  // Handle resend verification function
  const handleResendVerification = () => {
    // Prepare additional state for navigation
    const additionalState = getAdditionalStateFromLocation(location.state);    
    resendVerificationEmail(email, password, additionalState);
  };

  // Handle login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(email, password, setIsEmailUnverified);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    loginError: loginError || authLoginError,
    isEmailUnverified,
    resendingVerification,
    handleResendVerification,
    handleLogin
  };
}
