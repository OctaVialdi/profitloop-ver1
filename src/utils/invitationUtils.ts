
import { supabase } from "@/integrations/supabase/client";

/**
 * Validate an invitation token - simplified version
 */
export async function validateToken(token: string, email: string): Promise<{ 
  valid: boolean; 
  message: string;
}> {
  try {
    console.log("Invitation system is disabled");
    return {
      valid: false,
      message: "Fitur undangan saat ini tidak tersedia."
    };
  } catch (error: any) {
    console.error("Error validating token:", error);
    return { 
      valid: false, 
      message: error.message 
    };
  }
}
