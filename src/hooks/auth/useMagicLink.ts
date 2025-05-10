
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MagicLinkParams, MagicLinkResult } from "./types";
import { useNavigate } from "react-router-dom";

export function useMagicLink(params: MagicLinkParams): MagicLinkResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [organizationName, setOrganizationName] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const processInvitation = async () => {
      try {
        // Handle error from URL parameters
        if (params.errorCode && params.errorDescription) {
          setError(`Error ${params.errorCode}: ${params.errorDescription}`);
          return;
        }

        // Handle auth token from hash parameters
        if (params.accessToken && params.refreshToken) {
          try {
            // Set the session using the tokens
            await supabase.auth.setSession({
              access_token: params.accessToken,
              refresh_token: params.refreshToken,
            });
            
            // Check if we have an organization_id in the user metadata
            const { data: userData } = await supabase.auth.getUser();
            
            if (userData.user) {
              const orgId = userData.user.user_metadata?.organization_id;
              
              if (orgId) {
                // Get organization name
                const { data: orgData } = await supabase
                  .from('organizations')
                  .select('name')
                  .eq('id', orgId)
                  .single();
                  
                if (orgData) {
                  setOrganizationName(orgData.name);
                }
                
                setSuccess(true);
                return;
              }
            }
          } catch (err) {
            console.error("Error setting session:", err);
            setError("Failed to authenticate with the provided tokens");
          }
        }

        // Check for token from invitation
        if (!params.token && !params.accessToken) {
          setError("No invitation token or authentication token found");
          setIsLoading(false);
          return;
        }

        // Since magic_link_invitations table has been removed, we can't process tokens
        if (params.token) {
          setError("Magic link invitations are no longer supported");
        }
      } finally {
        setIsLoading(false);
      }
    };

    processInvitation();
  }, [
    params.token,
    params.email,
    params.errorCode,
    params.errorDescription,
    params.accessToken,
    params.refreshToken,
    params.type
  ]);

  return {
    isLoading,
    error,
    success,
    organizationName
  };
}
