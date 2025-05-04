
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useOrganizationNavigation } from "./useOrganizationNavigation";
import { checkExistingOrganization, updateUserWithOrganization } from "@/services/api/organizationApi";
import { ensureProfileExists } from "@/services/profileService";

/**
 * Hook for handling organization auth-related checks
 */
export const useOrganizationAuth = () => {
  const [isChecking, setIsChecking] = useState(true);
  const { redirectToLogin, redirectToEmployeeWelcome } = useOrganizationNavigation();

  const checkAuthAndOrganization = async () => {
    try {
      setIsChecking(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("Not authenticated, redirecting to login");
        redirectToLogin("Anda belum login. Silakan login terlebih dahulu.");
        return false;
      } 
      
      console.log("User is authenticated:", session.user.id);
      
      // Skip profile creation attempts since they cause infinite recursion
      // Only check auth metadata instead
      if (session.user.user_metadata?.organization_id) {
        console.log("User already has an organization in metadata:", session.user.user_metadata.organization_id);
        toast.info("Anda sudah memiliki organisasi.");
        redirectToEmployeeWelcome();
        return false;
      }
      
      try {
        // Check if email is verified - use auth data directly
        if (!session.user.email_confirmed_at) {
          console.log("Email not verified, redirecting to login");
          redirectToLogin("Anda harus memverifikasi email terlebih dahulu. Silakan cek email Anda.");
          return false;
        }
        
        // Instead of checking with checkExistingOrganization which uses profiles table,
        // check if this email created an organization directly
        const { data: orgData } = await supabase
          .from('organizations')
          .select('id')
          .eq('creator_email', session.user.email?.toLowerCase())
          .maybeSingle();
        
        if (orgData?.id) {
          console.log("Found organization created by this email:", orgData.id);
          
          // Update user metadata instead of profile
          await supabase.auth.updateUser({
            data: {
              organization_id: orgData.id,
              role: 'super_admin'
            }
          });
            
          toast.info("Anda sudah memiliki organisasi.");
          redirectToEmployeeWelcome();
          return false;
        }
        
        return true;
      } catch (error) {
        // If there's an error, allow continuing to organization setup
        // Better than blocking the user completely
        console.error("Error in org check:", error);
        return true;
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      toast.error("Terjadi kesalahan saat memeriksa autentikasi.");
      redirectToLogin();
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAuthAndOrganization();
  }, []);

  return {
    isChecking
  };
};
