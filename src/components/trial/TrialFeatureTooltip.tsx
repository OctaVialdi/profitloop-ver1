
import { useOrganization } from "@/hooks/useOrganization";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Crown, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { formatTrialCountdown } from "@/utils/organizationUtils";
import PremiumFeatureBadge from "./PremiumFeatureBadge";

interface TrialFeatureTooltipProps {
  children: ReactNode;
  featureName: string;
  isPremiumOnly?: boolean;
  description?: string;
}

const TrialFeatureTooltip = ({
  children,
  featureName,
  isPremiumOnly = false,
  description,
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
        <div className={`relative ${isTrialExpired ? 'feature-locked' : ''}`}>
          <TooltipTrigger asChild>
            <div className="group">
              {children}
              {showTooltip && <PremiumFeatureBadge variant="minimal" />}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            align="center" 
            className="premium-tooltip-content max-w-[280px] p-4 animate-in fade-in-50 zoom-in-95 duration-300"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {isTrialActive ? (
                  <Sparkles className="h-4 w-4 text-amber-500" />
                ) : (
                  <Crown className="h-4 w-4 text-purple-500" />
                )}
                <h4 className="font-semibold text-sm">{featureName}</h4>
              </div>
              
              <p className="text-xs text-muted-foreground mb-1">
                {description || "Fitur premium untuk meningkatkan produktivitas dan efisiensi bisnis Anda."}
              </p>
              
              {isTrialActive ? (
                <div className="premium-status-indicator trial">
                  <div className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 p-2 rounded-md border border-blue-100">
                    Tersedia selama masa trial • Berakhir {formatTrialCountdown(trialEndDate)}
                  </div>
                </div>
              ) : (
                <div className="premium-status-indicator locked">
                  <div className="text-xs bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 p-2 rounded-md border border-amber-100">
                    Fitur premium memerlukan langganan • Trial telah berakhir
                  </div>
                </div>
              )}
              
              <a 
                href="/settings/subscription" 
                className="text-xs mt-1 text-purple-600 hover:text-purple-700 font-medium self-end"
              >
                Upgrade Sekarang →
              </a>
            </div>
          </TooltipContent>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TrialFeatureTooltip;
