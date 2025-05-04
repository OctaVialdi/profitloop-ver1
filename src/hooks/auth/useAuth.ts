import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { ensureProfileExists } from "@/services/profileService";
import { toast } from "@/components/ui/sonner";

export interface AuthCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // Listen for auth state changes
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
              
              // Handle SIGNED_UP or SIGNED_IN events specifically
              if (event === 'SIGNED_UP' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
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
                        throw directError;
                      } else {
                        console.log("Direct profile creation success on auth event");
                      }
                    } catch (insertErr) {
                      console.error("Direct insert failed, trying fallback:", insertErr);
                      
                      // Fallback to helper function
                      const profileCreated = await ensureProfileExists(session.user.id, {
                        email: session.user.email || '',
                        full_name: session.user.user_metadata?.full_name || null,
                        email_verified: isEmailVerified
                      });
                      
                      console.log("Fallback profile creation result:", profileCreated);
                    }
                  }
                } catch (err) {
                  console.error("Error in profile verification check:", err);
                }
              }
              
              // Always ensure profile exists regardless of auth event
              await ensureProfileExists(session.user.id, {
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || null,
                email_verified: isEmailVerified
              });
            } catch (err) {
              console.error("Error in auth listener profile creation/update:", err);
            }
          }, 0);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is logged in, ensure profile exists
      if (session?.user) {
        const isEmailVerified = session.user.email_confirmed_at !== null;
        
        ensureProfileExists(session.user.id, {
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || null,
          email_verified: isEmailVerified
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
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
      
      // After successful login, make sure profile exists and set email as verified
      if (data.user) {
        const fullName = data.user.user_metadata?.full_name || null;
        const emailVerified = data.user.email_confirmed_at !== null;
        
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
        errorMessage = "Email belum diverifikasi. Mohon verifikasi email terlebih dahulu.";
      }
      
      setLoginError(errorMessage);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success("Berhasil keluar dari akun");
      return { error: null };
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Gagal keluar dari akun");
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    loginError,
    user,
    session,
    signInWithEmailPassword,
    signOut,
    setLoginError
  };
}
