
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfileExists } from "@/services/profileService";
import { AuthState } from "./types";
import { cleanupAuthState } from "@/utils/authUtils";

/**
 * Hook to manage authentication state and listen for auth changes
 */
export function useAuthState(): AuthState {
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    let isMounted = true;
    
    // Function to handle profile creation with debounce protection
    const handleProfileCreation = async (userId: string, email: string, metadata: any) => {
      if (!isMounted) return;
      
      try {
        // Use setTimeout to avoid potential auth state deadlocks
        setTimeout(async () => {
          if (!isMounted) return;
          
          const isEmailVerified = metadata?.email_confirmed_at !== null;
          
          try {
            // First check if profile exists
            const { data: profileData } = await supabase
              .from('profiles')
              .select('id, email_verified')
              .eq('id', userId)
              .maybeSingle();
              
            if (profileData) {
              console.log("Profile already exists, no need to create");
              return;
            }
            
            // Only try to create profile if it doesn't exist
            await ensureProfileExists(userId, {
              email: email || '',
              full_name: metadata?.full_name || null,
              email_verified: isEmailVerified
            });
          } catch (err) {
            console.error("Error in profile creation:", err);
          }
        }, 500); // Add slight delay to avoid race conditions
      } catch (err) {
        console.error("Error in auth listener profile handling:", err);
      }
    };

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        // Clean up if we're signing out
        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setSession(null);
            setUser(null);
            setIsLoading(false);
            // Additional cleanup to ensure clean state
            cleanupAuthState();
          }
          return;
        }
        
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsLoading(false);
          
          // If user is logged in, ensure profile exists but don't block the UI
          if (currentSession?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
            handleProfileCreation(
              currentSession.user.id,
              currentSession.user.email || '',
              currentSession.user.user_metadata
            );
          }
        }
      }
    );

    // Then check for existing session
    const checkExistingSession = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          cleanupAuthState(); // Clean up if there's an error
          if (isMounted) {
            setLoginError(error.message);
            setIsLoading(false);
            setAuthInitialized(true);
          }
          return;
        }
        
        if (isMounted) {
          setSession(existingSession);
          setUser(existingSession?.user ?? null);
          
          // If user is logged in, ensure profile exists
          if (existingSession?.user) {
            console.log("Found existing session for user:", existingSession.user.id);
            handleProfileCreation(
              existingSession.user.id,
              existingSession.user.email || '',
              existingSession.user.user_metadata
            );
          } else {
            console.log("No active session found");
          }
          
          setIsLoading(false);
          setAuthInitialized(true);
        }
      } catch (err) {
        console.error("Exception in checkExistingSession:", err);
        if (isMounted) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    checkExistingSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    isLoading,
    loginError,
    session,
    user,
    authInitialized
  };
}
