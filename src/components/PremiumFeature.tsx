
import { ReactNode } from 'react';

interface PremiumFeatureProps {
  children: ReactNode;
  featureName: string; 
  description?: string;
}

/**
 * Simplified version that just renders children since premium features are removed
 */
const PremiumFeature = ({ children }: PremiumFeatureProps) => {
  // Just return the children directly without any premium checks
  return <>{children}</>;
};

export default PremiumFeature;
