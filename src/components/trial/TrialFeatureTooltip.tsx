
import { useOrganization } from "@/hooks/useOrganization";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { ReactNode } from "react";
import { formatTrialCountdown } from "@/utils/organizationUtils";

interface TrialFeatureTooltipProps {
  children: ReactNode;
  featureName: string;
  isPremiumOnly?: boolean;
}

const TrialFeatureTooltip = ({
  children,
  featureName,
  isPremiumOnly = false,
}: TrialFeatureTooltipProps) => {
  const { isTrialActive, organization, hasPaidSubscription, daysLeftInTrial } = useOrganization();
  
  // If user has active subscription or feature is not premium-only, just show the children
  if (hasPaidSubscription || !isPremiumOnly) {
    return <>{children}</>;
  }
  
  const showTooltip = isPremiumOnly && !hasPaidSubscription;
  const isTrialExpired = !isTrialActive && !hasPaidSubscription;
  const trialEndDate = organization?.trial_end_date;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <div className={`relative ${isTrialExpired ? 'opacity-50 pointer-events-none' : ''}`}>
          <TooltipTrigger asChild>
            <div className="group">
              {children}
              {showTooltip && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  <InfoIcon className="w-3 h-3" />
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[250px] p-3">
            <div className="text-sm">
              <p className="font-bold mb-1">{featureName}</p>
              {isTrialActive ? (
                <div>
                  <p>Fitur premium tersedia selama masa trial.</p>
                  <p className="mt-1 text-xs bg-blue-50 text-blue-700 p-1 rounded">
                    Trial berakhir {formatTrialCountdown(trialEndDate)}
                  </p>
                </div>
              ) : (
                <div>
                  <p>Fitur premium memerlukan langganan aktif.</p>
                  <p className="mt-1 text-xs bg-amber-50 text-amber-700 p-1 rounded">
                    Trial telah berakhir
                  </p>
                </div>
              )}
            </div>
          </TooltipContent>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TrialFeatureTooltip;
