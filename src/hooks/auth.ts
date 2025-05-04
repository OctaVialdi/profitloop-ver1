
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

/**
 * Hook to get and manage authentication state
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setLoading(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data?.session || null);
        setUser(data?.session?.user || null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
      }
    );

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return {
    user,
    session,
    loading
  };
};
