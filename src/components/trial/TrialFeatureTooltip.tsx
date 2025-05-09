
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrganization } from "@/hooks/useOrganization";
import { useTrialTooltip } from "@/hooks/trial/useTrialTooltip";
import TooltipHeader from "./tooltip/TooltipHeader";
import TrialActiveContent from "./tooltip/TrialActiveContent";
import TrialExpiredContent from "./tooltip/TrialExpiredContent";

interface TrialFeatureTooltipProps {
  children: ReactNode;
  featureName: string;
  isPremiumOnly?: boolean;
  showBadge?: boolean;
}

const TrialFeatureTooltip = ({
  children,
  featureName,
  isPremiumOnly = false,
  showBadge = true,
}: TrialFeatureTooltipProps) => {
  const { isTrialActive, hasPaidSubscription } = useOrganization();
  const {
    isHovering,
    setIsHovering,
    isMobile,
    showTooltip,
    isTrialExpired,
    trialEndDate,
    daysLeftInTrial,
    calculateTrialProgress,
    getProgressColorClass,
    handleTooltipOpen,
    handleUpgradeClick,
  } = useTrialTooltip(featureName, isPremiumOnly);
  
  // If user has active subscription or feature is not premium-only, just show the children
  if (hasPaidSubscription || !isPremiumOnly) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <div 
          className={`relative ${isTrialExpired ? 'opacity-50 pointer-events-none' : ''}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <TooltipTrigger asChild>
            <div className="group relative">
              {children}
              {showTooltip && showBadge && (
                <div 
                  className={`absolute -top-1 -right-1 bg-gradient-to-br from-blue-400 to-purple-500 
                              text-white rounded-full w-5 h-5 flex items-center justify-center text-xs 
                              shadow-lg transition-all duration-300
                              ${isHovering ? 'animate-pulse scale-125' : 'animate-in fade-in duration-200'}`}>
                  <Sparkles className="w-3 h-3" />
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side={isMobile ? "bottom" : "top"}
            align="center"
            className="max-w-[320px] p-4 bg-white border border-blue-100 shadow-lg rounded-lg 
                     animate-in fade-in zoom-in-95 duration-200"
            onPointerDownOutside={(e) => e.preventDefault()}
            onFocus={handleTooltipOpen}
          >
            <div className="text-sm space-y-3">
              <TooltipHeader 
                featureName={featureName}
                isTrialActive={isTrialActive}
                isTrialExpired={isTrialExpired}
              />
              
              {isTrialActive ? (
                <TrialActiveContent
                  trialEndDate={trialEndDate}
                  calculateTrialProgress={calculateTrialProgress}
                  getProgressColorClass={getProgressColorClass}
                  daysLeftInTrial={daysLeftInTrial}
                  handleUpgradeClick={handleUpgradeClick}
                />
              ) : (
                <TrialExpiredContent
                  handleUpgradeClick={handleUpgradeClick}
                />
              )}
            </div>
          </TooltipContent>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TrialFeatureTooltip;
