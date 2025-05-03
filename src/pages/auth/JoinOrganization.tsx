
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import LoadingState from "@/components/auth/magic-link/LoadingState";
import SuccessState from "@/components/auth/magic-link/SuccessState";
import ErrorState from "@/components/auth/magic-link/ErrorState";
import { useMagicLinkHandler } from "@/hooks/auth/useMagicLinkHandler";
import { MagicLinkParams } from "@/hooks/auth/types";
import { processMagicLinkToken, getOrganizationName } from "@/hooks/auth/magicLinkUtils";

const JoinOrganization = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { processMagicLinkToken: processMagicLink } = useMagicLinkHandler();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [organizationName, setOrganizationName] = useState("");

  useEffect(() => {
    const handleMagicLinkInvitation = async () => {
      try {
        console.log("JoinOrganization: Processing invitation");
        console.log("URL:", window.location.href);
        console.log("Search params:", location.search);
        console.log("Hash:", location.hash);
        
        // Parse URL parameters
        const url = new URL(window.location.href);
        const params: MagicLinkParams = {
          token: url.searchParams.get("token"),
          email: url.searchParams.get("email"),
          type: url.searchParams.get("type"),
        };

        // Parse hash parameters if they exist (for Supabase auth redirect)
        if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          params.accessToken = hashParams.get("access_token");
          params.refreshToken = hashParams.get("refresh_token");
          params.type = hashParams.get("type") || params.type;
          
          // If we have errors in the hash
          params.errorCode = hashParams.get("error_code");
          params.errorDescription = hashParams.get("error_description");
        }
        
        console.log("Parsed params:", params);

        // Handle errors from Supabase auth
        if (params.errorCode) {
          setError(`Authentication error: ${params.errorDescription || params.errorCode}`);
          setIsLoading(false);
          return;
        }

        // Check if we have a token from the magic link
        if (!params.token) {
          setError("Invalid invitation link. Missing token parameter.");
          setIsLoading(false);
          return;
        }
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // If not authenticated but we have an access token in the URL
          if (params.accessToken && params.refreshToken) {
            // Set the session from the URL parameters
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: params.accessToken,
              refresh_token: params.refreshToken
            });

            if (sessionError) {
              console.error("Failed to set session:", sessionError);
              setError("Authentication failed. Please try logging in again.");
              setIsLoading(false);
              return;
            }
            
            // Get user again after setting session
            const { data: { user: newUser } } = await supabase.auth.getUser();
            
            if (!newUser) {
              setError("Failed to authenticate with the provided token.");
              setIsLoading(false);
              return;
            }

            // Process the invitation token
            const result = await processMagicLink(newUser.id, params.token);
            
            if (result) {
              // Get organization name for success message
              const orgName = await getOrganizationName(newUser.user_metadata.organization_id || "");
              setOrganizationName(orgName);
              setSuccess(true);
            } else {
              setError("Failed to join organization. The invitation may have expired.");
            }
          } else if (params.email && params.token) {
            // If not authenticated and no access token, redirect to login with invitation parameters
            const redirectUrl = `/auth/login?invitation_token=${params.token}&email=${encodeURIComponent(params.email || "")}`;
            navigate(redirectUrl);
            return;
          } else {
            setError("Authentication required. Please log in to join the organization.");
          }
        } else {
          // User is authenticated, process the invitation token
          const result = await processMagicLink(user.id, params.token);
          
          if (result) {
            // Get organization name for success message
            const orgName = await getOrganizationName(user.user_metadata.organization_id || "");
            setOrganizationName(orgName);
            setSuccess(true);
          } else {
            setError("Failed to join organization. The invitation may have expired or is invalid.");
          }
        }
        
      } catch (error: any) {
        console.error("Error processing invitation:", error);
        setError(error.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    handleMagicLinkInvitation();
  }, [location, navigate]);

  const handleManualLogin = () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");
    
    navigate(`/auth/login?invitation_token=${token}&email=${encodeURIComponent(email || "")}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {isLoading ? (
        <LoadingState message="Processing your invitation..." />
      ) : error ? (
        <ErrorState 
          error={error} 
          email={new URL(window.location.href).searchParams.get("email")} 
          token={new URL(window.location.href).searchParams.get("token")} 
          onManualLogin={handleManualLogin}
        />
      ) : (
        <SuccessState 
          organizationName={organizationName} 
          onContinue={() => navigate("/dashboard")} 
        />
      )}
    </div>
  );
};

export default JoinOrganization;
