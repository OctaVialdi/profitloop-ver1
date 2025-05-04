
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { MagicLinkParams, MagicLinkResult } from "./types";
import { processMagicLinkToken, validateInvitationToken, getOrganizationName } from "./magicLinkUtils";

export function useMagicLink(params: MagicLinkParams): MagicLinkResult {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [organizationName, setOrganizationName] = useState<string>("");

  useEffect(() => {
    console.log("useMagicLink hook running with params:", params);
    
    const handleMagicLinkProcess = async () => {
      // Check if there's an error in the URL
      if (params.errorCode || params.errorDescription || window.location.hash.includes('error=access_denied')) {
        const errorMsg = params.errorDescription?.replace(/\+/g, ' ') || "Link undangan tidak valid atau sudah kadaluarsa";
        console.error("Error from Supabase auth:", params.errorCode, errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }
      
      // Process the access token if present (from Supabase magic link)
      if (params.accessToken && params.refreshToken) {
        try {
          console.log("Setting session from URL hash tokens");
          
          const { data, error } = await supabase.auth.setSession({
            access_token: params.accessToken,
            refresh_token: params.refreshToken
          });
          
          if (error) {
            console.error("Error setting session from tokens:", error);
            throw error;
          }
          
          if (!data || !data.session) {
            console.error("No session returned when setting session");
            throw new Error("Gagal mengatur sesi dari magic link");
          }
          
          console.log("Auth session set successfully:", data.session.user.id);
          
          // Get user metadata from JWT claims
          const userMetadata = data.session.user.user_metadata;
          console.log("User metadata from session:", userMetadata);
          
          // If we have a token from the URL, process the invitation
          if (params.token || userMetadata?.invitation_token) {
            const invitationToken = params.token || userMetadata?.invitation_token;
            
            const { success, message, organizationId, role } = await processMagicLinkToken(
              data.session.user.id, 
              invitationToken as string
            );

            if (!success) {
              setError(message || "Token undangan tidak valid atau sudah kadaluarsa");
              setIsLoading(false);
              return;
            }

            // Get organization name from metadata or from database
            let orgName = userMetadata?.organization_name;
            
            // If organization name is not in metadata, fetch from database
            if (!orgName && organizationId) {
              orgName = await getOrganizationName(organizationId);
            }

            setOrganizationName(orgName || "");
            toast.success("Berhasil bergabung dengan organisasi!");
            setSuccess(true);
            setIsLoading(false);
            
            // Update user metadata with organization info
            if (organizationId) {
              await supabase.auth.updateUser({
                data: {
                  organization_id: organizationId,
                  role: role || userMetadata?.role || "employee"
                }
              });
            }
            
            // Delay before redirect to welcome page
            setTimeout(() => {
              navigate("/employee-welcome", { 
                state: { 
                  organizationName: orgName,
                  role: role || userMetadata?.role || "employee" 
                }
              });
            }, 2000);
            
            return;
          } else {
            // If we don't have a token but authentication succeeded, require login first
            toast.success("Email berhasil diverifikasi! Silakan login untuk melanjutkan.");
            navigate("/auth/login");
            return;
          }
        } catch (error: any) {
          console.error("Error processing magic link authentication:", error);
          setError(error.message || "Terjadi kesalahan saat memproses undangan");
          setIsLoading(false);
          return;
        }
      }

      // If there's no access token in the URL hash but we have a token in the URL parameters,
      // and the user is not logged in, redirect to login page with the token
      if (params.token && !params.accessToken) {
        try {
          // Check if user is already logged in
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            // If not logged in, show join organization page with token
            console.log("No user found, showing join organization page with token");
            // Continue with the rendering of the join organization page
            setIsLoading(false);
            return;
          }
          
          // If user is logged in, process the invitation token
          console.log("User already logged in, processing invitation token");
          const { success, message, organizationId, role } = await processMagicLinkToken(
            user.id, 
            params.token
          );

          if (!success) {
            setError(message || "Token undangan tidak valid atau sudah kadaluarsa");
            setIsLoading(false);
            return;
          }

          // Get organization name if joining was successful
          let orgName = "";
          if (organizationId) {
            orgName = await getOrganizationName(organizationId);
          }

          setOrganizationName(orgName);
          toast.success("Berhasil bergabung dengan organisasi!");
          setSuccess(true);
          setIsLoading(false);
          
          // Delay before redirect to welcome page
          setTimeout(() => {
            navigate("/employee-welcome", { 
              state: { 
                organizationName: orgName,
                role: role || "employee" 
              }
            });
          }, 2000);
        } catch (error: any) {
          console.error("Unexpected error:", error);
          setError(error.message || "Terjadi kesalahan saat memproses undangan");
          setIsLoading(false);
        }
      } else if (!params.token && !params.accessToken) {
        setError("Tidak ada token undangan yang ditemukan");
        setIsLoading(false);
      }
    };

    handleMagicLinkProcess();
  }, [
    params.token,
    navigate,
    organizationName,
    params.email,
    params.errorCode,
    params.errorDescription,
    params.accessToken,
    params.refreshToken,
    params.type,
    params.redirectTo
  ]);

  return {
    isLoading,
    error,
    success,
    organizationName
  };
}
