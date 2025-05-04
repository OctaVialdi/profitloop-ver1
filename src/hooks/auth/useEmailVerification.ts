
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
      
      // Try to create a profile for this email if possible
      try {
        // Get user by email
        // Note: The admin.listUsers() doesn't support a filter parameter directly
        // Let's query for users and filter manually
        const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
        
        if (!userError && users) {
          // Find the user with matching email
          const user = users.find(u => u.email === email);
          
          if (user) {
            const userId = user.id;
            console.log("Found user ID for email:", userId);
            
            // Check if profile exists
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', userId)
              .maybeSingle();
              
            // Create profile if it doesn't exist
            if (!existingProfile) {
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: userId,
                  email: email.toLowerCase(),
                  email_verified: false
                });
                
              if (profileError) {
                console.error("Error creating profile during resend:", profileError);
              } else {
                console.log("Profile created during resend verification");
              }
            }
          }
        }
      } catch (profileError) {
        console.error("Error checking/creating profile during resend:", profileError);
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
