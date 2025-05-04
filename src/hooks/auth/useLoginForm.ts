
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./useAuth";
import { useEmailVerification } from "./useEmailVerification";
import { useMagicLinkHandler } from "./useMagicLinkHandler";
import { useUserProfile } from "./useUserProfile";
import { useEmailCheck } from "./useEmailCheck";
import { supabase } from "@/integrations/supabase/client";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isLoading: authLoading, loginError, signInWithEmailPassword, setLoginError } = useAuth();
  const { isEmailUnverified, setIsEmailUnverified, resendingVerification, resendVerificationEmail } = useEmailVerification();
  const { processMagicLinkToken, processInvitationToken } = useMagicLinkHandler();
  const { getUserOrganization } = useUserProfile();
  const { checkEmailExists, isCheckingEmail } = useEmailCheck();
  
  const isLoading = authLoading || isCheckingEmail;
  
  // Pre-fill email from location state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else if (location.state?.verifiedEmail) {
      setEmail(location.state.verifiedEmail);
    }
  }, [location.state?.email, location.state?.verifiedEmail]);

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
      
      const credentials = { email, password };
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
        
        // Check if user's profile is marked as email_verified
        const { data: profileData } = await supabase
          .from('profiles')
          .select('email_verified, organization_id, has_seen_welcome')
          .eq('id', data.user.id)
          .maybeSingle();
          
        // Check if user has organization and follow the flow chart
        if (profileData?.organization_id) {
          if (!profileData.has_seen_welcome) {
            navigate("/employee-welcome");
          } else {
            navigate("/dashboard");
          }
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
    isLoading,
    loginError,
    isEmailUnverified,
    resendingVerification,
    handleResendVerification,
    handleLogin
  };
}
