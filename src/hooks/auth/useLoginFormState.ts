
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export function useLoginFormState() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const location = useLocation();
  
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

  return {
    email,
    setEmail,
    password,
    setPassword
  };
}
