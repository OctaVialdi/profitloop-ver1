
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { ensureProfileExists, getAuthErrorMessage } from "@/utils/authUtils";
import { AuthCredentials, AuthSignInResult } from "./types";
import { cleanupAuthState } from "@/utils/authUtils";

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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

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
      
      // Get user-friendly error message
      const errorMessage = getAuthErrorMessage(error);
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
