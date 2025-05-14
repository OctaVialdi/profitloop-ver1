
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./useAuth";
import { useEmailCheck } from "./useEmailCheck";
import { useTokenProcessor } from "./useTokenProcessor";
import { useMagicLinkHandler } from "./useMagicLinkHandler";
import { cleanupAuthState } from "@/utils/authUtils"; 

export function useLoginSubmit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithEmailPassword, loginError, setLoginError } = useAuth();
  const { checkEmailExists, isCheckingEmail } = useEmailCheck();
  const { processMagicLinkToken, processInvitationToken } = useMagicLinkHandler();
  const { processUserAuth } = useTokenProcessor();

  const handleSubmit = async (
    email: string, 
    password: string, 
    setIsEmailUnverified: (value: boolean) => void
  ) => {
    setIsEmailUnverified(false);
    setIsLoading(true);
    
    try {
      // Clean up auth state before attempting login to prevent conflicts
      cleanupAuthState();
      
      // First check if the email exists in our database
      const emailExists = await checkEmailExists(email);
      
      if (!emailExists) {
        // If email doesn't exist, redirect to registration
        toast.info("Email tidak ditemukan. Silakan daftar terlebih dahulu.");
        navigate("/auth/register", { state: { email } });
        return;
      }
      
      // Use this structure to avoid any promise chain issues
      try {
        // Clear any leftover sessions first
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (signOutError) {
          // Ignore errors during pre-sign-out
          console.log("Pre-signin signout (normal):", signOutError);
        }
        
        const credentials = { email, password };
        const { data, error } = await signInWithEmailPassword(credentials);
  
        if (error) {
          // Check specifically for email verification errors
          if (error.message && 
              (error.message.includes("Email not confirmed") || 
               error.message.includes("not confirmed") || 
               error.message.toLowerCase().includes("email") && error.message.toLowerCase().includes("confirm"))) {
            setIsEmailUnverified(true);
            throw new Error("Email belum dikonfirmasi. Silakan verifikasi email Anda terlebih dahulu.");
          }
          throw error;
        }
        
        if (data?.user) {
          // Check email verification status directly before proceeding
          if (!data.user.email_confirmed_at) {
            setIsEmailUnverified(true);
            setLoginError("Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda atau kirim ulang email verifikasi.");
            setIsLoading(false);
            return;
          }
          
          toast.success("Login berhasil!");
          
          // Handle magic link token if present
          const magicLinkToken = location.state?.magicLinkToken;
          if (magicLinkToken) {
            const success = await processMagicLinkToken(data.user.id, magicLinkToken);
            // If successful, the navigation happens inside processMagicLinkToken
            if (success) {
              setIsLoading(false);
              return;
            }
          }
          
          // Handle invitation token (legacy) if present
          else if (location.state?.invitationToken) {
            const success = await processInvitationToken(data.user.id, location.state.invitationToken);
            // If successful, the navigation happens inside processInvitationToken
            if (success) {
              setIsLoading(false);
              return;
            }
          }
          
          // Standard auth flow navigation
          await processUserAuth(data.user.id);
        }
      } catch (loginError: any) {
        console.error("Login error:", loginError);
        
        if (loginError.message.includes("Email not confirmed") || 
            loginError.message.includes("Email belum dikonfirmasi") ||
            loginError.message.toLowerCase().includes("email") && loginError.message.toLowerCase().includes("konfirmasi")) {
          setLoginError("Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda atau kirim ulang email verifikasi.");
          setIsEmailUnverified(true);
        } else {
          setLoginError(loginError.message || "Gagal login. Silakan coba lagi.");
        }
      }
    } catch (error: any) {
      console.error("Login process error:", error);
      setLoginError(error.message || "Terjadi kesalahan. Silakan coba lagi nanti.");
      // Database errors are already handled in useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading: isLoading || isCheckingEmail,
    loginError
  };
}
