
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth, AuthCredentials } from "./auth/useAuth";
import { useEmailVerification } from "./auth/useEmailVerification";
import { useMagicLinkHandler } from "./auth/useMagicLinkHandler";
import { useUserProfile } from "./auth/useUserProfile";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isLoading, loginError, signInWithEmailPassword, setLoginError } = useAuth();
  const { isEmailUnverified, setIsEmailUnverified, resendingVerification, resendVerificationEmail } = useEmailVerification();
  const { processMagicLinkToken, processInvitationToken } = useMagicLinkHandler();
  const { getUserOrganization } = useUserProfile();
  
  // Pre-fill email from location state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state?.email]);

  // Handle resend verification function
  const handleResendVerification = () => {
    // Prepare additional state for navigation
    const additionalState = {
      ...(location.state?.invitationToken && { 
        isInvitation: true, 
        invitationToken: location.state.invitationToken 
      }),
      ...(location.state?.magicLinkToken && {
        magicLinkToken: location.state.magicLinkToken
      })
    };
    
    resendVerificationEmail(email, password, additionalState);
  };

  // Handle login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailUnverified(false);
    
    try {
      const credentials: AuthCredentials = { email, password };
      const { data, error } = await signInWithEmailPassword(credentials);

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setIsEmailUnverified(true);
          throw new Error("Email belum dikonfirmasi. Silakan verifikasi email Anda terlebih dahulu.");
        }
        throw error;
      }
      
      if (data?.user) {
        toast.success("Login berhasil!");
        
        // Handle magic link token if present
        const magicLinkToken = location.state?.magicLinkToken;
        if (magicLinkToken) {
          const success = await processMagicLinkToken(data.user.id, magicLinkToken);
          // If successful, the navigation happens inside processMagicLinkToken
          if (success) return;
        }
        
        // Handle invitation token (legacy) if present
        else if (location.state?.invitationToken) {
          const success = await processInvitationToken(data.user.id, location.state.invitationToken);
          // If successful, the navigation happens inside processInvitationToken
          if (success) return;
        }
        
        // Check if user has organization
        const organizationId = await getUserOrganization(data.user.id);
        if (organizationId) {
          navigate("/dashboard");
        } else {
          // Always redirect to onboarding if user doesn't have organization
          navigate("/onboarding");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message.includes("Email not confirmed") || error.message.includes("Email belum dikonfirmasi")) {
        setLoginError("Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda atau kirim ulang email verifikasi.");
        setIsEmailUnverified(true);
      }
      // Database errors are already handled in useAuth hook
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    loginError,
    isEmailUnverified,
    resendingVerification,
    handleResendVerification,
    handleLogin
  };
}
