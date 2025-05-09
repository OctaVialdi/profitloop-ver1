
import { useOrganization } from "@/hooks/useOrganization";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Sparkles, Clock, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { formatTrialCountdown } from "@/utils/organizationUtils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { trackTrialEvent } from "@/services/analyticsService";

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
  const { isTrialActive, organization, hasPaidSubscription, daysLeftInTrial } = useOrganization();
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  // If user has active subscription or feature is not premium-only, just show the children
  if (hasPaidSubscription || !isPremiumOnly) {
    return <>{children}</>;
  }
  
  const showTooltip = isPremiumOnly && !hasPaidSubscription;
  const isTrialExpired = !isTrialActive && !hasPaidSubscription;
  const trialEndDate = organization?.trial_end_date;

  // Calculate trial progress percentage
  const calculateTrialProgress = () => {
    if (!organization?.trial_start_date || !organization?.trial_end_date) return 100;
    
    const start = new Date(organization.trial_start_date).getTime();
    const end = new Date(organization.trial_end_date).getTime();
    const now = new Date().getTime();
    const totalDuration = end - start;
    const elapsed = now - start;
    
    // Return remaining percentage (100 to 0)
    return Math.max(0, Math.min(100, 100 - (elapsed / totalDuration * 100)));
  };

  // Progress color based on remaining time
  const getProgressColorClass = () => {
    if (daysLeftInTrial <= 1) return 'trial-progress-low';
    if (daysLeftInTrial <= 3) return 'trial-progress-medium';
    return 'trial-progress-high';
  };

  // Track tooltip interactions
  const handleTooltipOpen = () => {
    if (organization?.id && isPremiumOnly) {
      trackTrialEvent('tooltip_viewed', organization.id, {
        feature_name: featureName,
        days_left: daysLeftInTrial,
        is_expired: isTrialExpired
      });
    }
  };

  // Track upgrade button click
  const handleUpgradeClick = () => {
    if (organization?.id) {
      trackTrialEvent('tooltip_upgrade_click', organization.id, {
        feature_name: featureName,
        days_left: daysLeftInTrial,
        is_expired: isTrialExpired
      });
    }
  };

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
            align={isMobile ? "center" : "center"}
            className="max-w-[320px] p-4 bg-white border border-blue-100 shadow-lg rounded-lg 
                     animate-in fade-in zoom-in-95 duration-200"
            onPointerDownOutside={(e) => e.preventDefault()}
            onOpenAutoFocus={handleTooltipOpen}
          >
            <div className="text-sm space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-blue-700 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-amber-400" />
                  {featureName}
                </p>
                
                {isTrialActive && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    Trial Active
                  </span>
                )}
                
                {isTrialExpired && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    Trial Expired
                  </span>
                )}
              </div>
              
              {isTrialActive ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <p>Fitur premium tersedia selama masa trial.</p>
                  </div>
                  
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-md border border-blue-100 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        Trial berakhir:
                      </span>
                      <span className="font-bold">{formatTrialCountdown(trialEndDate)}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                      <Progress 
                        value={calculateTrialProgress()} 
                        className={`h-2 ${getProgressColorClass()}`} 
                      />
                    </div>

                    {daysLeftInTrial <= 3 && (
                      <div className="text-xs text-amber-600 flex items-center mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {daysLeftInTrial <= 1 
                          ? "Trial berakhir dalam kurang dari 24 jam!" 
                          : `Trial berakhir dalam ${daysLeftInTrial} hari!`}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-1">
                    <a 
                      href="/settings/subscription"
                      onClick={handleUpgradeClick}
                      className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 
                               hover:from-blue-600 hover:to-purple-600 text-white text-xs py-2 
                               rounded-md transition-colors"
                    >
                      Upgrade Sekarang
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>Fitur premium memerlukan langganan aktif.</p>
                  </div>
                  
                  <div className="bg-amber-50 text-amber-700 p-3 rounded-md border border-amber-100">
                    <p className="flex items-center text-sm">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      Trial telah berakhir
                    </p>
                  </div>
                  
                  <div className="pt-1 flex gap-2">
                    <a 
                      href="/settings/subscription"
                      onClick={handleUpgradeClick}
                      className="block flex-1 text-center bg-gradient-to-r from-blue-500 to-purple-500 
                               hover:from-blue-600 hover:to-purple-600 text-white text-xs py-2 
                               rounded-md transition-colors"
                    >
                      Upgrade Sekarang
                    </a>
                    
                    <a 
                      href="/settings/subscription?request=extension"
                      className="block px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 
                               text-xs rounded-md transition-colors"
                    >
                      <InfoIcon className="h-3.5 w-3.5" />
                    </a>
                  </div>
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
