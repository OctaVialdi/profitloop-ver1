
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
        
        // If user is logged in or just signed up, ensure profile exists
        if (session?.user) {
          // Use setTimeout to avoid potential auth state deadlocks
          setTimeout(async () => {
            try {
              // Handle SIGNED_UP event specifically - using proper string type comparison
              if (event.toString() === "SIGNED_UP") {
                console.log("New signup detected, creating profile");
                
                // Force create profile for new signup
                const profileCreated = await ensureProfileExists(session.user.id, {
                  email: session.user.email || '',
                  full_name: session.user.user_metadata?.full_name || null,
                  email_verified: session.user.email_confirmed_at !== null
                });
                
                console.log("Profile created on signup:", profileCreated);
                
                if (!profileCreated) {
                  // Direct fallback if the helper function fails
                  try {
                    const { error: insertError } = await supabase
                      .from('profiles')
                      .insert({
                        id: session.user.id,
                        email: session.user.email || '',
                        full_name: session.user.user_metadata?.full_name || null,
                        email_verified: session.user.email_confirmed_at !== null
                      });
                      
                    if (insertError) {
                      console.error("Direct profile creation error:", insertError);
                    } else {
                      console.log("Direct profile creation success");
                    }
                  } catch (directErr) {
                    console.error("Direct insert attempt failed:", directErr);
                  }
                }
              }
              
              // For all auth events, ensure profile exists
              const profileCreated = await ensureProfileExists(session.user.id, {
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || null,
                email_verified: session.user.email_confirmed_at !== null
              });
              
              console.log("Profile ensure result:", profileCreated);
            } catch (err) {
              console.error("Error in auth listener profile creation:", err);
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
        ensureProfileExists(session.user.id, {
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || null,
          email_verified: session.user.email_confirmed_at !== null
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
