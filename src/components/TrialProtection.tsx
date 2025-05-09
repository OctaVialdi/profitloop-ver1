
import React from "react";
import { useOrganization } from "@/hooks/useOrganization";

interface TrialProtectionProps {
  children: React.ReactNode;
}

// This component will render children only if the user's organization has an active subscription or trial
const TrialProtection: React.FC<TrialProtectionProps> = ({ children }) => {
  const organizationData = useOrganization();
  
  // Always render children, regardless of trial status
  // The actual blocking is handled by the TrialBanner component which shows a modal overlay
  return <>{children}</>;
};

export default TrialProtection;
