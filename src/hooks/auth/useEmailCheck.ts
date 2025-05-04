
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useEmailCheck() {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      setIsCheckingEmail(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      
      if (error) {
        console.error("Error checking email:", error);
        return true; // Assume email exists if there's an error checking
      }
      
      return !!data; // Return true if data exists (email found)
    } catch (error) {
      console.error("Exception checking email:", error);
      return true; // Assume email exists on error
    } finally {
      setIsCheckingEmail(false);
    }
  };

  return {
    checkEmailExists,
    isCheckingEmail
  };
}
