
import { useState } from "react";
import { AuthCredentials } from "./types";
import { useAuthState } from "./useAuthState";
import { useSignIn } from "./useSignIn";
import { useSignOut } from "./useSignOut";

/**
 * Main authentication hook that combines auth state, sign-in, and sign-out functionality
 */
export function useAuth() {
  const { session, user } = useAuthState();
  const { signInWithEmailPassword, isLoading: isSigningIn, loginError, setLoginError } = useSignIn();
  const { signOut, isLoading: isSigningOut } = useSignOut();
  
  // Combine loading states
  const isLoading = isSigningIn || isSigningOut;
  
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

// Re-export the original interface for backwards compatibility
export interface AuthCredentials {
  email: string;
  password: string;
}
