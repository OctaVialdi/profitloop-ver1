
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./useAuth";
import { useEmailVerification } from "./useEmailVerification";
import { useMagicLinkHandler } from "./useMagicLinkHandler";
import { useUserProfile } from "./useUserProfile";
import { useEmailCheck } from "./useEmailCheck";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeTime } from "@/utils/formatUtils";

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

  // Automatically check email verification status on mount if coming from verification
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (location.search === "?verified=true" && email) {
        try {
          // Check if user exists and is verified
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && user.email === email && user.email_confirmed_at) {
            // Ensure profile reflects verification
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ email_verified: true })
              .eq('id', user.id);
              
            if (updateError) {
              console.error("Error updating profile verification:", updateError);
            } else {
              toast.success("Email telah terverifikasi. Silakan login.");
            }
          }
        } catch (error) {
          console.error("Error checking verification status:", error);
        }
      }
    };
    
    checkVerificationStatus();
  }, [email, location.search]);

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
        // If email doesn't exist, show specific error message
        setLoginError("Email tidak terdaftar. Silakan daftar terlebih dahulu.");
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
        
        // Check if the error is about invalid credentials (password)
        if (error.message && 
            (error.message.includes("Invalid login credentials") ||
             error.message.includes("invalid_credentials"))) {
             
          // Try to check if this could be a changed password scenario
          await checkForPasswordChange(email);
          
          // If no password change detected, show generic message
          throw new Error("Password salah. Mohon periksa kembali.");
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
        
        // Ensure profile reflects verified status
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ email_verified: true })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error("Error updating profile verification on login:", updateError);
          }
        } catch (updateError) {
          console.error("Failed to update verification status on login:", updateError);
        }
        
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
        
        // Check if user's profile exists and get relevant data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('email_verified, organization_id, has_seen_welcome')
          .eq('id', data.user.id)
          .maybeSingle();
          
        // Follow the authentication flow according to the flowchart
        if (profileData && !profileData.email_verified) {
          // Email not verified in our database, update the flag
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ email_verified: true })
            .eq('id', data.user.id);
          
          if (updateError) {
            console.error("Error updating email verification status:", updateError);
          }
        }
          
        // Check if user has organization and follow the flow chart
        if (profileData?.organization_id) {
          if (!profileData.has_seen_welcome) {
            navigate("/employee-welcome", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } else {
          // Always redirect to organizations if user doesn't have organization
          navigate("/organizations", { replace: true });
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message.includes("Email not confirmed") || 
          error.message.includes("Email belum dikonfirmasi") ||
          error.message.toLowerCase().includes("email") && error.message.toLowerCase().includes("konfirmasi")) {
        setLoginError("Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda atau kirim ulang email verifikasi.");
        setIsEmailUnverified(true);
      }
      // Database errors are already handled in useAuth hook
    }
  };

  // Helper function to check if password was recently changed
  const checkForPasswordChange = async (email: string) => {
    try {
      // Mock audit log data for demonstration
      // In a real app, you might query a real audit log table
      const auditLogs = {
        action: 'password_change',
        user_email: email,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      };

      if (auditLogs) {
        const timeAgo = formatRelativeTime(new Date(auditLogs.created_at));
        setLoginError(`Password salah. Password untuk akun ini telah diubah ${timeAgo}. Silakan gunakan password baru.`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error checking for password change:", error);
      return false;
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
