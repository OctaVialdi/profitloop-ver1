
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfileExists } from "@/services/profileService";
import { AuthState } from "./types";

/**
 * Hook to manage authentication state and listen for auth changes
 */
export function useAuthState(): AuthState {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    setIsLoading(true);
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user is logged in or just signed up, ensure profile exists and email verification is synced
        if (session?.user) {
          // Use setTimeout to avoid potential auth state deadlocks
          setTimeout(async () => {
            try {
              // Check if user's email is verified in auth system
              const isEmailVerified = session.user.email_confirmed_at !== null;
              
              // Handle auth events using string type comparison instead
              if (event === 'SIGNED_UP' || 
                  event === 'SIGNED_IN' || 
                  event === 'USER_UPDATED') {
                console.log(`${event} detected, ensuring profile and verification status`);
                
                try {
                  // First check if profile exists
                  const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id, email_verified')
                    .eq('id', session.user.id)
                    .maybeSingle();
                    
                  if (profileData) {
                    // Profile exists, update email verification if needed
                    if (isEmailVerified && !profileData.email_verified) {
                      const { error: updateError } = await supabase
                        .from('profiles')
                        .update({ email_verified: true })
                        .eq('id', session.user.id);
                        
                      if (updateError) {
                        console.error("Error updating email verification status:", updateError);
                      } else {
                        console.log("Profile email_verified set to true");
                      }
                    }
                  } else {
                    // Profile doesn't exist, create it
                    console.log("Profile not found, creating new profile");
                    
                    // Direct insert for new signups - most reliable method
                    try {
                      const { error: directError } = await supabase
                        .from('profiles')
                        .insert({
                          id: session.user.id,
                          email: session.user.email || '',
                          full_name: session.user.user_metadata?.full_name || null,
                          email_verified: isEmailVerified,
                          role: session.user.user_metadata?.role || 'employee'
                        });
                        
                      if (directError) {
                        console.error("Direct profile creation error:", directError);
                      } else {
                        console.log("Direct profile creation success on auth event");
                      }
                    } catch (insertErr) {
                      console.error("Direct insert failed, trying fallback:", insertErr);
                      
                      // Fallback to helper function
                      await ensureProfileExists(session.user.id, {
                        email: session.user.email || '',
                        full_name: session.user.user_metadata?.full_name || null,
                        email_verified: isEmailVerified
                      });
                    }
                  }
                } catch (err) {
                  console.error("Error in profile verification check:", err);
                }
              }
            } catch (err) {
              console.error("Error in auth listener profile creation/update:", err);
            }
          }, 0);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Checking for existing session:", !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is logged in, ensure profile exists
      if (session?.user) {
        const isEmailVerified = session.user.email_confirmed_at !== null;
        console.log("Active session found, ensuring profile exists for user:", session.user.id);
        
        ensureProfileExists(session.user.id, {
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || null,
          email_verified: isEmailVerified
        });
      }
      
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  return {
    isLoading,
    loginError,
    session,
    user
  };
}
