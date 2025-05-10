
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface TrialProtectionProps {
  children: ReactNode;
  requiredSubscription?: boolean;
}

// This is now a simplified component that just returns children since we've removed subscription features
const TrialProtection = ({ children }: TrialProtectionProps) => {
  return <>{children}</>;
};

export default TrialProtection;
