
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useVerificationHandler() {
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const navigate = useNavigate();

  // Get additional state from location to maintain during navigation
  const getAdditionalStateFromLocation = (locationState: any) => {
    return {
      ...(locationState?.invitationToken && { 
        isInvitation: true, 
        invitationToken: locationState.invitationToken 
      }),
      ...(locationState?.magicLinkToken && {
        magicLinkToken: locationState.magicLinkToken
      })
    };
  };

  return {
    isEmailUnverified,
    setIsEmailUnverified,
    getAdditionalStateFromLocation
  };
}
