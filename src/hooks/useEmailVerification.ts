
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

interface UseEmailVerificationProps {
  email: string;
  password: string;
  invitationToken?: string;
}

export function useEmailVerification({ 
  email, 
  password, 
  invitationToken 
}: UseEmailVerificationProps) {
  const [showTip, setShowTip] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [allowResend, setAllowResend] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show tip about checking spam folder after 5 seconds
    const tipTimer = setTimeout(() => {
      setShowTip(true);
    }, 5000);
    
    // Start countdown timer for resend
    const countdownTimer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setAllowResend(true);
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Check verification status every 10 seconds if we have both email and password
    let verificationChecker: NodeJS.Timeout | null = null;
    if (email && password) {
      verificationChecker = setInterval(async () => {
        try {
          setCheckingVerification(true);
          
          // Instead of signing in, just check if the email is verified
          const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false // Just check, don't create
            }
          });
          
          if (error && error.message.includes("Email not confirmed")) {
            // Email still not verified
            console.log("Verification check: email not yet verified");
          } else {
            // Email is verified, always redirect to login page first
            clearInterval(verificationChecker!);
            toast.success("Email berhasil diverifikasi! Silakan login untuk melanjutkan.");
            
            // Always redirect to login after verification
            navigate("/auth/login?verified=true", { 
              state: { 
                email, 
                verifiedEmail: email,
                ...(invitationToken && { invitationToken })
              } 
            });
          }
        } catch (err) {
          // Ignore errors, just keep checking
          console.log("Verification check error:", err);
        } finally {
          setCheckingVerification(false);
        }
      }, 10000); // Check every 10 seconds
    }
    
    return () => {
      clearTimeout(tipTimer);
      clearInterval(countdownTimer);
      if (verificationChecker) {
        clearInterval(verificationChecker);
      }
    };
  }, [email, password, navigate, invitationToken]);

  const handleResendVerification = async () => {
    if (!email || !allowResend) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Email verifikasi berhasil dikirim ulang!");
      setAllowResend(false);
      setSecondsLeft(60);
      
      // Restart countdown
      const countdownTimer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setAllowResend(true);
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Show tip about checking spam folder immediately
      setShowTip(true);
    } catch (error: any) {
      console.error("Error resending verification:", error);
      toast.error("Gagal mengirim ulang email verifikasi");
    }
  };

  return {
    showTip,
    secondsLeft,
    allowResend,
    checkingVerification,
    handleResendVerification
  };
}
