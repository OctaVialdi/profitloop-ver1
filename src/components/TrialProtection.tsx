
import React from "react";
import { useOrganization } from "@/hooks/useOrganization";

interface TrialProtectionProps {
  children: React.ReactNode;
}

// This component previously managed trial protection,
// but now just passes through children since trial functionality is removed
const TrialProtection: React.FC<TrialProtectionProps> = ({ children }) => {
  // We still use the organization data hook but don't enforce trial-related redirects
  const organizationData = useOrganization();
  
  // Always render children, regardless of trial status
  return <>{children}</>;
};

export default TrialProtection;
