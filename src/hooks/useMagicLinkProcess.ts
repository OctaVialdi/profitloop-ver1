
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface MagicLinkProcessResult {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  organizationName: string;
}

export interface MagicLinkParams {
  token: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  errorCode: string | null;
  errorDescription: string | null;
  type: string | null;
  redirectTo: string | null;
}

export function useMagicLinkProcess({
  token,
  email,
  accessToken,
  refreshToken,
  errorCode,
  errorDescription,
  type,
  redirectTo
}: MagicLinkParams): MagicLinkProcessResult {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [organizationName, setOrganizationName] = useState<string>("");

  useEffect(() => {
    // Log useful debugging information
    console.log("useMagicLinkProcess hook running");
    console.log("URL parameters:", { token, email, errorCode, errorDescription, type, redirectTo });
    console.log("Hash parameters:", { accessToken, refreshToken });
    
    const processInvitation = async () => {
      // Check if there's an error in the URL
      if (errorCode || errorDescription || window.location.hash.includes('error=access_denied')) {
        console.error("Error from Supabase auth:", errorCode, errorDescription);
        setError(errorDescription?.replace(/\+/g, ' ') || "Link undangan tidak valid atau sudah kadaluarsa");
        setIsLoading(false);
        return;
      }
      
      // For invite type verification through Supabase
      if (type === 'invite' && token) {
        console.log("Processing Supabase invitation link");
        try {
          // If user is not logged in, we can't process the invitation yet
          // Will be handled on the join organization page
          setIsLoading(false);
          return;
        } catch (error: any) {
          console.error("Error processing Supabase invitation:", error);
          setError(error.message || "Terjadi kesalahan saat memproses undangan");
          setIsLoading(false);
          return;
        }
      }
      
      // IMPORTANT: Process the access token if present (from Supabase magic link)
      if (accessToken && refreshToken) {
        try {
          console.log("Setting session from URL hash tokens");
          
          // Set session manually using the tokens from the URL hash
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error("Error setting session from tokens:", error);
            throw error;
          }
          
          if (!data || !data.session) {
            console.error("No session returned when setting session");
            throw new Error("Failed to set session from magic link");
          }
          
          console.log("Auth session set successfully:", data.session.user.id);
          
          // Get user metadata from JWT claims
          const userMetadata = data.session.user.user_metadata;
          console.log("User metadata from session:", userMetadata);
          
          // If we have a token from the URL, process the invitation
          if (token || userMetadata?.invitation_token) {
            const invitationToken = token || userMetadata?.invitation_token;
            
            console.log("Processing invitation with token:", invitationToken);
            
            // Process the magic link invitation
            const { data: result, error: joinError } = await supabase.rpc(
              'process_magic_link_invitation',
              { 
                invitation_token: invitationToken,
                user_id: data.session.user.id
              }
            );

            if (joinError) {
              console.error("Error processing invitation:", joinError);
              setError(joinError.message || "Gagal memproses undangan");
              setIsLoading(false);
              return;
            }

            // Handle the response as JSON object
            const invitationResult = result as { 
              success: boolean, 
              message: string, 
              organization_id?: string, 
              role?: string 
            };

            console.log("Invitation processing result:", invitationResult);

            if (!invitationResult.success) {
              setError(invitationResult.message || "Token undangan tidak valid atau sudah kadaluarsa");
              setIsLoading(false);
              return;
            }

            // Get organization name from metadata or from database
            let orgName = userMetadata?.organization_name;
            
            // If organization name is not in metadata, fetch from database
            if (!orgName && invitationResult.organization_id) {
              const { data: orgData } = await supabase
                .from('organizations')
                .select('name')
                .eq('id', invitationResult.organization_id)
                .maybeSingle();

              if (orgData) {
                orgName = orgData.name;
              }
            }

            setOrganizationName(orgName || "");
            toast.success("Berhasil bergabung dengan organisasi!");
            setSuccess(true);
            setIsLoading(false);
            
            // Update user metadata with organization info
            if (invitationResult.organization_id) {
              await supabase.auth.updateUser({
                data: {
                  organization_id: invitationResult.organization_id,
                  role: invitationResult.role || userMetadata?.role || "employee"
                }
              });
            }
            
            // Delay before redirect to welcome page
            setTimeout(() => {
              navigate("/employee-welcome", { 
                state: { 
                  organizationName: orgName,
                  role: invitationResult.role || userMetadata?.role || "employee" 
                }
              });
            }, 2000);
            
            return;
          } else {
            // If we don't have a token but authentication succeeded, redirect to dashboard
            toast.success("Login berhasil!");
            navigate("/dashboard");
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
      if (token && !accessToken) {
        try {
          // Check if user is already logged in
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            // If not logged in, redirect to login page with token
            console.log("No user found, showing join organization page with token");
            // Continue with the rendering of the join organization page
            setIsLoading(false);
            return;
          }
          
          // If user is logged in, process the invitation token
          console.log("User already logged in, processing invitation token");
          const { data: joinResult, error: joinError } = await supabase.rpc(
            'process_magic_link_invitation',
            { 
              invitation_token: token,
              user_id: user.id
            }
          );

          if (joinError) {
            console.error("Error processing invitation:", joinError);
            setError(joinError.message || "Gagal memproses undangan");
            setIsLoading(false);
            return;
          }

          // Handle the response
          const invitationResult = joinResult as { 
            success: boolean, 
            message: string, 
            organization_id?: string, 
            role?: string 
          };

          if (!invitationResult.success) {
            setError(invitationResult.message || "Token undangan tidak valid atau sudah kadaluarsa");
            setIsLoading(false);
            return;
          }

          // Get organization name if joining was successful
          if (invitationResult.organization_id) {
            const { data: orgData } = await supabase
              .from('organizations')
              .select('name')
              .eq('id', invitationResult.organization_id)
              .maybeSingle();

            if (orgData) {
              setOrganizationName(orgData.name);
            }
          }

          toast.success("Berhasil bergabung dengan organisasi!");
          setSuccess(true);
          setIsLoading(false);
          
          // Delay before redirect to welcome page
          setTimeout(() => {
            navigate("/employee-welcome", { 
              state: { 
                organizationName,
                role: invitationResult.role || "employee" 
              }
            });
          }, 2000);
        } catch (error: any) {
          console.error("Unexpected error:", error);
          setError(error.message || "Terjadi kesalahan saat memproses undangan");
          setIsLoading(false);
        }
      } else if (!token && !accessToken) {
        setError("Tidak ada token undangan yang ditemukan");
        setIsLoading(false);
      }
    };

    processInvitation();
  }, [token, navigate, organizationName, email, errorCode, errorDescription, accessToken, refreshToken, type, redirectTo]);

  return {
    isLoading,
    error,
    success,
    organizationName
  };
}
