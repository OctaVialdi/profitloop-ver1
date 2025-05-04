
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useOrganizationNavigation } from "./useOrganizationNavigation";
import { checkExistingOrganization, updateUserWithOrganization } from "@/services/api/organizationApi";

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
      
      const { hasOrganization, emailVerified, organizationId } = await checkExistingOrganization(
        session.user.id, 
        session.user.email
      );
      
      // Check if email is verified
      if (!emailVerified) {
        console.log("Email not verified, redirecting to login");
        redirectToLogin("Anda harus memverifikasi email terlebih dahulu. Silakan cek email Anda.");
        return false;
      }
      
      // Check if user already has an organization
      if (hasOrganization && organizationId) {
        console.log("User already has an organization:", organizationId);
        
        // If this is from creator_email check, we need to update the profile
        if (!session.user.user_metadata?.organization_id) {
          await updateUserWithOrganization(session.user.id, organizationId);
        }
        
        toast.info("Anda sudah memiliki organisasi.");
        redirectToEmployeeWelcome();
        return false;
      }

      return true;
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
