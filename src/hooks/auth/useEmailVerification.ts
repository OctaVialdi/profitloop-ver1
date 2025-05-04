
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

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
