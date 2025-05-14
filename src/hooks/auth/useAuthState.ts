
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { AuthState } from "./types";

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null, // Added session property
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const fetchUserProfile = useCallback(async (user: User) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setState((prev) => ({ ...prev, profile: null, error }));
        return;
      }

      setState((prev) => ({
        ...prev,
        profile: data,
        isLoading: false,
        isAuthenticated: true,
      }));
    } catch (error: any) {
      console.error("Exception fetching profile:", error);
      setState((prev) => ({ ...prev, profile: null, error, isLoading: false }));
    }
  }, []);

  const handleAuthStateChange = useCallback(
    async (event: string, session: Session | null) => {
      if (!session) {
        setState({
          user: null,
          profile: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        return;
      }

      try {
        const user = session.user;
        setState((prev) => ({ ...prev, user, session, isLoading: true }));
        await fetchUserProfile(user);
      } catch (error: any) {
        console.error("Error handling auth state change:", error);
        setState((prev) => ({ ...prev, error, isLoading: false }));
      }
    },
    [fetchUserProfile]
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data && data.session) {
          const user = data.session.user;
          setState((prev) => ({ ...prev, user, session: data.session, isLoading: true }));
          await fetchUserProfile(user);
        } else {
          setState((prev) => ({
            ...prev,
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          }));
        }
      } catch (error: any) {
        console.error("Error initializing auth:", error);
        setState((prev) => ({ ...prev, error, isLoading: false }));
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      handleAuthStateChange
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile, handleAuthStateChange]);

  return state;
}
