
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./useAuth";
import { useEmailVerification } from "./useEmailVerification";
import { useMagicLinkHandler } from "./useMagicLinkHandler";
import { useUserProfile } from "./useUserProfile";
import { useEmailCheck } from "./useEmailCheck";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/authCleanup";

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
          console.log("Checking verification status after redirect");
          // Clean up auth state first
          cleanupAuthState();
          
          // Check if user exists and is verified
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && user.email === email && user.email_confirmed_at) {
            console.log("User is verified, updating profile");
            // Ensure profile reflects verification
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ email_verified: true })
              .eq('id', user.id);
              
            if (updateError) {
              console.error("Error updating profile verification:", updateError);
            } else {
              console.log("Profile verification updated successfully");
              toast.success("Email telah terverifikasi. Silakan login.");
            }
          } else {
            console.log("User verification check: not verified or user not found");
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
      console.log("Starting login process...");
      
      // Clean up auth state first to ensure clean login
      cleanupAuthState();
      
      // First check if the email exists in our database
      const emailExists = await checkEmailExists(email);
      
      if (!emailExists) {
        // If email doesn't exist, redirect to registration
        console.log("Email not found, redirecting to registration");
        toast.info("Email tidak ditemukan. Silakan daftar terlebih dahulu.");
        navigate("/auth/register", { state: { email } });
        return;
      }
      
      console.log("Starting login process for:", email);
      const credentials = { email, password };
      const { data, error } = await signInWithEmailPassword(credentials);

      if (error) {
        console.error("Login error details:", error);
        // Check specifically for email verification errors
        if (error.message && 
            (error.message.includes("Email not confirmed") || 
             error.message.includes("not confirmed") || 
             error.message.toLowerCase().includes("email") && error.message.toLowerCase().includes("confirm"))) {
          console.log("Email not confirmed error detected");
          setIsEmailUnverified(true);
          throw new Error("Email belum dikonfirmasi. Silakan verifikasi email Anda terlebih dahulu.");
        }
        throw error;
      }
      
      if (data?.user) {
        console.log("Login successful for user:", data.user.id);
        
        // Check email verification status directly before proceeding
        if (!data.user.email_confirmed_at) {
          console.log("Email not verified, showing verification prompt");
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
          } else {
            console.log("Profile verification updated on login");
          }
        } catch (updateError) {
          console.error("Failed to update verification status on login:", updateError);
        }
        
        // Handle magic link token if present
        const magicLinkToken = location.state?.magicLinkToken;
        if (magicLinkToken) {
          console.log("Processing magic link token");
          const success = await processMagicLinkToken(data.user.id, magicLinkToken);
          // If successful, the navigation happens inside processMagicLinkToken
          if (success) return;
        }
        
        // Handle invitation token (legacy) if present
        else if (location.state?.invitationToken) {
          console.log("Processing invitation token");
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
          } else {
            console.log("Profile verification status updated");
          }
        }
          
        // Check if user has organization and follow the flow chart
        if (profileData?.organization_id) {
          if (!profileData.has_seen_welcome) {
            console.log("Redirecting to employee welcome page");
            navigate("/employee-welcome", { replace: true });
          } else {
            console.log("Redirecting to dashboard");
            navigate("/dashboard", { replace: true });
          }
        } else {
          // Always redirect to organizations if user doesn't have organization
          console.log("Redirecting to organizations page");
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
