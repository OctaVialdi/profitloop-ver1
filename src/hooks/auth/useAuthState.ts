
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { AuthState } from "./types";

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const fetchUserProfile = useCallback(async (user: User) => {
    // Use setTimeout to prevent potential deadlocks with auth state changes
    setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
  
        if (error) {
          console.error("Error fetching profile:", error);
          setState((prev) => ({ ...prev, profile: null, error, isLoading: false }));
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
    }, 0);
  }, []);

  const handleAuthStateChange = useCallback(
    (event: string, session: Session | null) => {
      console.log("Auth state change event:", event);
      
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

      // Only set user and session synchronously
      setState((prev) => ({ 
        ...prev, 
        user: session.user, 
        session, 
        isLoading: true,
        isAuthenticated: true,
      }));
      
      // Then fetch profile asynchronously
      fetchUserProfile(session.user);
    },
    [fetchUserProfile]
  );

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Set up auth listener first
        const { data: authListener } = supabase.auth.onAuthStateChange(
          handleAuthStateChange
        );

        // Then check for existing session
        const { data } = await supabase.auth.getSession();
        
        if (mounted) {
          if (data && data.session) {
            const user = data.session.user;
            setState((prev) => ({ 
              ...prev, 
              user, 
              session: data.session, 
              isLoading: true,
              isAuthenticated: true,
            }));
            fetchUserProfile(user);
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
        }

        return () => {
          mounted = false;
          authListener.subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setState((prev) => ({ ...prev, error, isLoading: false }));
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [fetchUserProfile, handleAuthStateChange]);

  return state;
}
