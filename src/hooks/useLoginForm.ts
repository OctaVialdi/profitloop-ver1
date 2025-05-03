
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth, AuthCredentials } from "./auth/useAuth";
import { useEmailVerification } from "./auth/useEmailVerification";
import { useMagicLinkHandler } from "./auth/useMagicLinkHandler";
import { useUserProfile } from "./auth/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  
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

  // Check if email exists in the database before attempting login
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      setCheckingEmail(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      
      if (error) {
        console.error("Error checking email:", error);
        return true; // Assume email exists if there's an error checking
      }
      
      return !!data; // Return true if data exists (email found)
    } catch (error) {
      console.error("Exception checking email:", error);
      return true; // Assume email exists on error
    } finally {
      setCheckingEmail(false);
    }
  };

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
      // First check if the email exists in our database
      const emailExists = await checkEmailExists(email);
      
      if (!emailExists) {
        // If email doesn't exist, redirect to registration
        toast.info("Email tidak ditemukan. Silakan daftar terlebih dahulu.");
        navigate("/auth/register", { state: { email } });
        return;
      }
      
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
          // Always redirect to organizations if user doesn't have organization
          navigate("/organizations");
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
    isLoading: isLoading || checkingEmail,
    loginError,
    isEmailUnverified,
    resendingVerification,
    handleResendVerification,
    handleLogin
  };
}
