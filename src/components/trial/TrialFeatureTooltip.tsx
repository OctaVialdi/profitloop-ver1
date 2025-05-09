
import React, { ReactNode, useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrganization } from '@/hooks/useOrganization';

interface TrialFeatureTooltipProps {
  children: ReactNode;
  featureName: string;
  isPremiumOnly: boolean;
}

const TrialFeatureTooltip: React.FC<TrialFeatureTooltipProps> = ({ 
  children, 
  featureName,
  isPremiumOnly
}) => {
  const { isTrialActive, daysLeftInTrial, hasPaidSubscription, organization } = useOrganization();
  const [mounted, setMounted] = useState(false);
  
  // Debugging logs
  useEffect(() => {
    console.log("TrialFeatureTooltip - organization:", organization);
    console.log("TrialFeatureTooltip - isTrialActive:", isTrialActive);
    console.log("TrialFeatureTooltip - daysLeftInTrial:", daysLeftInTrial);
    console.log("TrialFeatureTooltip - hasPaidSubscription:", hasPaidSubscription);
    setMounted(true);
  }, [organization, isTrialActive, daysLeftInTrial, hasPaidSubscription]);
  
  // Calculate the appropriate tooltip message
  const getTooltipMessage = () => {
    if (hasPaidSubscription) {
      return `${featureName} - Fitur Premium`;
    }
    
    if (isTrialActive) {
      return `${featureName} - Tersedia selama masa trial (${daysLeftInTrial} hari tersisa)`;
    }
    
    return `${featureName} - Fitur premium, perlu berlangganan`;
  };

  // If it's not a premium feature, just render the children
  if (!isPremiumOnly) {
    return <>{children}</>;
  }

  // Otherwise wrap it in a tooltip
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-blue-800 text-white border-blue-900 text-xs">
          <p>{getTooltipMessage()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TrialFeatureTooltip;
