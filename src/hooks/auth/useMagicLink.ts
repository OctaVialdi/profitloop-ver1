
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MagicLinkParams, MagicLinkResult } from "./types";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

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

        // Process magic link invitation with token
        if (params.token) {
          try {
            // Check if the token is a valid magic link invitation
            const { data: invitationData, error: invitationError } = await supabase
              .from('magic_link_invitations')
              .select('organization_id, email, role, status, expires_at, organizations(name)')
              .eq('token', params.token)
              .single();

            if (invitationError || !invitationData) {
              // If not found or error, check if it might be a different type of token
              setError("Invalid or expired invitation token");
              setIsLoading(false);
              return;
            }

            // Check if invitation is valid
            if (invitationData.status !== 'pending') {
              setError("This invitation has already been used");
              setIsLoading(false);
              return;
            }

            if (new Date(invitationData.expires_at) < new Date()) {
              setError("This invitation has expired");
              setIsLoading(false);
              return;
            }

            // Store organization name for display
            setOrganizationName(invitationData.organizations.name);
            
            // If email is provided, check if it matches
            if (params.email && params.email !== invitationData.email) {
              setError("The email address does not match the invitation");
              setIsLoading(false);
              return;
            }
            
            // Check if user is authenticated
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
              // User is already logged in, process the invitation
              const { data: result, error: processError } = await supabase.rpc(
                'process_magic_link_invitation',
                { 
                  invitation_token: params.token,
                  user_id: session.user.id
                }
              );
              
              if (processError) {
                throw processError;
              }
              
              if (result && result.success) {
                setSuccess(true);
              } else {
                setError(result?.message || "Failed to process invitation");
              }
            } else {
              // Not authenticated, but valid invitation
              // Let the UI handle this case (show login/register form)
              setSuccess(false);
            }
          } catch (err) {
            console.error("Error processing invitation:", err);
            setError("An error occurred while processing the invitation");
          }
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
