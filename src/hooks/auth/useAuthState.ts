
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null, 
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        if (session) {
          setState((prev) => ({
            ...prev,
            user: session.user,
            session,
            isAuthenticated: true,
            isLoading: false,
          }));
          
          // Fetch profile data after a small delay to avoid deadlocks
          setTimeout(() => {
            if (!isMounted) return;
            fetchUserProfile(session.user);
          }, 0);
        } else {
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      }
    );

    // Then check for an existing session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data && data.session && isMounted) {
          setState((prev) => ({
            ...prev, 
            user: data.session.user, 
            session: data.session, 
            isAuthenticated: true,
            isLoading: true
          }));
          
          // Fetch profile data after a small delay to avoid deadlocks
          setTimeout(() => {
            if (!isMounted) return;
            fetchUserProfile(data.session.user);
          }, 0);
        } else if (isMounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error: any) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setState((prev) => ({ ...prev, error, isLoading: false }));
        }
      }
    };

    const fetchUserProfile = async (user: User) => {
      try {
        if (!user || !isMounted) return;
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && isMounted) {
          console.error("Error fetching profile:", error);
          setState((prev) => ({ ...prev, profile: null, error, isLoading: false }));
          return;
        }

        if (isMounted) {
          setState((prev) => ({
            ...prev,
            profile: data,
            isLoading: false,
          }));
        }
      } catch (error: any) {
        console.error("Exception fetching profile:", error);
        if (isMounted) {
          setState((prev) => ({ ...prev, profile: null, error, isLoading: false }));
        }
      }
    };

    getInitialSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}

export interface AuthState {
  user: User | null;
  profile: any | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: any | null;
}
