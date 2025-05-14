
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./useAuth";
import { useEmailCheck } from "./useEmailCheck";
import { useTokenProcessor } from "./useTokenProcessor";
import { useMagicLinkHandler } from "./useMagicLinkHandler";

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
    setLoginError(null);
    
    try {
      // First check if the email exists in our database
      const emailExists = await checkEmailExists(email);
      
      if (!emailExists) {
        // If email doesn't exist, redirect to registration
        toast.info("Email tidak ditemukan. Silakan daftar terlebih dahulu.");
        
        // Use state to pass the email to registration page
        navigate("/auth/register", { 
          state: { email },
          replace: true // Use replace to avoid back button issues
        });
        return;
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
          return;
        }
        
        toast.success("Login berhasil!");
        
        // Handle magic link token if present
        const magicLinkToken = location.state?.magicLinkToken;
        if (magicLinkToken) {
          setTimeout(async () => {
            const success = await processMagicLinkToken(data.user.id, magicLinkToken);
            // If successful, the navigation happens inside processMagicLinkToken
            if (!success) {
              await processUserAuth(data.user.id);
            }
          }, 100);
          return;
        }
        
        // Handle invitation token (legacy) if present
        else if (location.state?.invitationToken) {
          setTimeout(async () => {
            const success = await processInvitationToken(data.user.id, location.state.invitationToken);
            // If successful, the navigation happens inside processInvitationToken
            if (!success) {
              await processUserAuth(data.user.id);
            }
          }, 100);
          return;
        }
        
        // Standard auth flow navigation with delay to avoid race conditions
        setTimeout(async () => {
          await processUserAuth(data.user.id);
        }, 100);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message.includes("Email not confirmed") || 
          error.message.includes("Email belum dikonfirmasi") ||
          error.message.toLowerCase().includes("email") && error.message.toLowerCase().includes("konfirmasi")) {
        setLoginError("Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda atau kirim ulang email verifikasi.");
        setIsEmailUnverified(true);
      } else {
        setLoginError(error.message || "Gagal login. Silakan coba lagi.");
      }
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
