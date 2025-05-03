
import { useSearchParams } from "react-router-dom";
import { useMagicLinkProcess } from "@/hooks/useMagicLinkProcess";
import LoadingState from "@/components/auth/magic-link/LoadingState";
import ErrorState from "@/components/auth/magic-link/ErrorState";
import SuccessState from "@/components/auth/magic-link/SuccessState";
import { useNavigate } from "react-router-dom";

const MagicLinkJoin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract URL parameters
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  // Extract hash parameters (for Supabase auth tokens)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  const errorCode = searchParams.get("error_code") || hashParams.get("error_code");
  const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");
  
  // Process the magic link invitation
  const { isLoading, error, success, organizationName } = useMagicLinkProcess({
    token,
    email,
    accessToken,
    refreshToken,
    errorCode,
    errorDescription
  });

  // Function to handle manual login with token
  const handleLoginAndJoin = () => {
    if (!email || !token) {
      return;
    }

    navigate("/auth/login", { 
      state: { 
        email,
        magicLinkToken: token 
      }
    });
  };

  // Render appropriate component based on state
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error} 
        email={email} 
        token={token} 
        onManualLogin={handleLoginAndJoin} 
      />
    );
  }

  if (success) {
    return <SuccessState organizationName={organizationName} />;
  }

  return null;
};

export default MagicLinkJoin;
