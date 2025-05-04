
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

export function useEmailVerification() {
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const navigate = useNavigate();

  const resendVerificationEmail = async (email: string, password?: string, additionalState?: Record<string, any>) => {
    if (!email) {
      toast.error("Email tidak boleh kosong");
      return;
    }
    
    setResendingVerification(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      toast.success("Email verifikasi berhasil dikirim ulang. Silakan cek kotak masuk email Anda.");
      
      // Try to update the profile's email verification status
      try {
        // Get the current user
        const { data: authData } = await supabase.auth.getUser();
        
        if (authData?.user) {
          // Check if email is verified in auth
          const isVerified = authData.user.email_confirmed_at !== null;
          
          if (isVerified) {
            // If email is verified in auth, ensure it's reflected in the profile
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ email_verified: true })
              .eq('id', authData.user.id);
              
            if (profileError) {
              console.error("Error updating profile during verification check:", profileError);
            } else {
              console.log("Profile updated to reflect email verification");
            }
          }
        }
      } catch (profileError) {
        console.error("Error checking/updating profile during resend:", profileError);
      }
      
      // Navigate to verification sent page with needed state
      navigate("/auth/verification-sent", { 
        state: { 
          email,
          ...(password && { password }),
          ...additionalState
        }
      });
    } catch (error: any) {
      console.error("Resend verification error:", error);
      
      // Handle rate limiting errors specifically
      if (error.message && error.message.includes("rate limit")) {
        toast.error("Terlalu banyak permintaan. Harap tunggu beberapa saat sebelum mengirim ulang.");
      } else {
        toast.error(error.message || "Gagal mengirim ulang email verifikasi.");
      }
    } finally {
      setResendingVerification(false);
    }
  };

  return {
    isEmailUnverified,
    setIsEmailUnverified,
    resendingVerification,
    resendVerificationEmail
  };
}
