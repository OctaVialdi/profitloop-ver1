
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { ensureProfileExists } from "@/services/profileService";
import { AuthCredentials, AuthSignInResult } from "./types";
import { cleanupAuthState } from "@/utils/authUtils";
import { forceSignIn } from "@/integrations/supabase/auth/signIn";

/**
 * Hook to handle user sign-in with email and password
 */
export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const signInWithEmailPassword = async (credentials: AuthCredentials): Promise<AuthSignInResult> => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Try a global sign out to ensure clean slate
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        // Continue even if this fails
        console.log("Pre-signin signout failed (this is often normal):", signOutError);
      }
      
      // Small delay to ensure clean state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try to use standard sign-in first
      console.log("Attempting standard sign in for:", credentials.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      // If we get an email verification error, we can try force sign-in for testing purposes
      if (error && error.message.includes("Email not confirmed")) {
        console.log("Email not confirmed, attempting force sign in");
        
        // Try force sign-in which can bypass email verification requirements
        const forceSignInResult = await forceSignIn(credentials.email, credentials.password);
        
        if (forceSignInResult.error) {
          throw forceSignInResult.error;
        }
        
        // If force sign-in succeeds, use that result
        if (forceSignInResult.data) {
          console.log("Force sign in succeeded");
          return { data: forceSignInResult.data, error: null };
        }
      }
      
      if (error) {
        throw error;
      }
      
      // After successful login, make sure profile exists and set email as verified
      if (data.user) {
        const fullName = data.user.user_metadata?.full_name || null;
        const emailVerified = data.user.email_confirmed_at !== null;
        
        // Use setTimeout to avoid potential auth state deadlocks
        setTimeout(async () => {
          try {
            // Create or update profile
            await ensureProfileExists(data.user.id, {
              email: data.user.email || '',
              full_name: fullName,
              email_verified: emailVerified
            });
            
            // Then update email_verified flag if needed
            if (emailVerified) {
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ email_verified: true })
                .eq('id', data.user.id);
                
              if (updateError) {
                console.error("Error marking email as verified:", updateError);
              }
            }
          } catch (profileError) {
            console.error("Error updating profile after login:", profileError);
          }
        }, 500);
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
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email belum diverifikasi. Mohon verifikasi email terlebih dahulu atau gunakan alternatif login.";
      }
      
      setLoginError(errorMessage);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithEmailPassword,
    isLoading,
    loginError,
    setLoginError
  };
}
