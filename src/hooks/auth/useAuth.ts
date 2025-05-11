
import { useState } from "react";
import { AuthCredentials } from "./types";
import { useAuthState } from "./useAuthState";
import { useSignIn } from "./useSignIn";
import { useSignOut } from "./useSignOut";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { robustSignOut } from "@/utils/authUtils";

/**
 * Main authentication hook that combines auth state, sign-in, and sign-out functionality
 */
export function useAuth() {
  const { user, session } = useAuthState();
  const { signInWithEmailPassword, isLoading: isSigningIn, loginError, setLoginError } = useSignIn();
  const { signOut, isLoading: isSigningOut } = useSignOut();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Combine loading states
  const isLoading = isSigningIn || isSigningOut || isDeleting;

  // Function to delete user account
  const deleteAccount = async () => {
    if (!user) {
      toast.error("Tidak ada pengguna yang terautentikasi");
      return;
    }
    
    setIsDeleting(true);
    try {
      console.log("Starting account deletion process for user:", user.id);
      
      // 1. Fetch user's organization data to clean up after
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, role, full_name')
        .eq('id', user.id)
        .single();

      console.log("User profile data:", profile);

      // 2. Use service role to delete user (client-side tokens don't have permission)
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: user.id }
      });

      if (error) {
        console.error("Error invoking delete-user function:", error);
        throw new Error(error.message || "Gagal menghapus akun");
      }
      
      console.log("Delete user function response:", data);
      
      toast.success("Akun berhasil dihapus");
      
      // 3. Sign out and redirect to register page
      await robustSignOut();
      window.location.href = "/auth/register";
      
    } catch (err: any) {
      console.error("Error deleting account:", err);
      toast.error(err.message || "Gagal menghapus akun");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Function to sign out from all sessions
  const signOutFromAllSessions = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        throw error;
      }
      
      toast.success("Berhasil keluar dari semua sesi");
      window.location.href = "/auth/login";
    } catch (err: any) {
      console.error("Error signing out from all sessions:", err);
      toast.error(err.message || "Gagal keluar dari semua sesi");
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
    deleteAccount,
    isDeleting,
    signOutFromAllSessions
  };
}

// Remove duplicate interface and re-export from types
export type { AuthCredentials } from "./types";
