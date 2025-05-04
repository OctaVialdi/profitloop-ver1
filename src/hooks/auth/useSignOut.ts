
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

/**
 * Hook to handle user sign-out process
 */
export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);

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
    signOut,
    isLoading
  };
}
