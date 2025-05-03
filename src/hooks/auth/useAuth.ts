
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

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
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
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
      
      // After successful login, make sure profile exists
      if (data.user) {
        await ensureProfileExists(data.user);
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

  // Ensure profile exists for user
  const ensureProfileExists = async (user: User) => {
    try {
      // Get role from user metadata 
      const role = user.user_metadata?.role || 'employee';
      
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error("Error checking profile:", profileError);
        return;
      }
      
      // If profile doesn't exist, create it with proper role
      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || null,
            role: role // Use role from metadata or default to employee
          });
          
        if (insertError) {
          console.error("Error creating profile:", insertError);
        } else {
          console.log("Profile created successfully with role:", role);
        }
      }
    } catch (error) {
      console.error("Error ensuring profile exists:", error);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      return { error: null };
    } catch (error) {
      console.error("Error signing out:", error);
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
    setLoginError,
    ensureProfileExists
  };
}
