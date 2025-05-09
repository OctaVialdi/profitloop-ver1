
import { useOrganization } from "@/hooks/useOrganization";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Sparkles } from "lucide-react";
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
                <div className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg animate-in fade-in duration-200 hover:scale-110 transition-transform">
                  <Sparkles className="w-3 h-3" />
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="max-w-[280px] p-4 bg-white border border-blue-100 shadow-lg rounded-lg animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="text-sm">
              <p className="font-bold mb-2 text-blue-700 flex items-center">
                <Sparkles className="w-4 h-4 mr-1 text-amber-400" />
                {featureName}
              </p>
              {isTrialActive ? (
                <div>
                  <p>Fitur premium tersedia selama masa trial.</p>
                  <p className="mt-2 text-xs bg-blue-50 text-blue-700 p-2 rounded-md border border-blue-100">
                    Trial berakhir {formatTrialCountdown(trialEndDate)}
                  </p>
                </div>
              ) : (
                <div>
                  <p>Fitur premium memerlukan langganan aktif.</p>
                  <p className="mt-2 text-xs bg-amber-50 text-amber-700 p-2 rounded-md border border-amber-100">
                    Trial telah berakhir
                  </p>
                  <a 
                    href="/settings/subscription"
                    className="block mt-2 text-xs bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md text-center transition-colors"
                  >
                    Upgrade Sekarang
                  </a>
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
