
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AuthCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Handle authentication with email and password
  const signInWithEmailPassword = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      // Format user-friendly error message
      let errorMessage = error.message || "Gagal login. Periksa email dan password Anda.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email atau password salah. Mohon periksa kembali.";
      } else if (error.message.includes("Database error")) {
        errorMessage = "Terjadi masalah server saat login. Mohon coba lagi dalam beberapa saat.";
      }
      
      setLoginError(errorMessage);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    loginError,
    signInWithEmailPassword,
    setLoginError
  };
}
