
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { subscriptionAnalyticsService } from '@/services/subscriptionAnalyticsService';

interface PremiumBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  featureName: string;
}

const PremiumBadge = ({ className, size = 'sm', featureName }: PremiumBadgeProps) => {
  const navigate = useNavigate();
  const { hasPaidSubscription, isTrialActive, daysLeftInTrial, organization } = useOrganization();
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'px-2.5 py-1'
  };
  
  const handleBadgeClick = () => {
    if (!hasPaidSubscription && !isTrialActive) {
      // Track this premium feature click
      subscriptionAnalyticsService.trackPremiumFeatureClicked(featureName, organization?.id);
      navigate('/settings/subscription');
    }
  };
  
  const badgeElement = (
    <Badge 
      variant="outline"
      className={cn(
        "bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer border-amber-200 flex items-center gap-1",
        sizeClasses[size],
        className
      )}
      onClick={handleBadgeClick}
    >
      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
      <span>Premium</span>
    </Badge>
  );
  
  let tooltipContent;
  
  if (hasPaidSubscription) {
    tooltipContent = (
      <p>Anda memiliki akses ke fitur premium ini</p>
    );
  } else if (isTrialActive) {
    tooltipContent = (
      <div className="space-y-1">
        <p>Fitur premium ini tersedia selama masa uji coba</p>
        <p className="text-xs text-amber-600">
          {daysLeftInTrial > 0 
            ? `${daysLeftInTrial} hari tersisa` 
            : "Trial segera berakhir"}
        </p>
      </div>
    );
  } else {
    tooltipContent = (
      <div className="space-y-1">
        <p>Fitur premium ini memerlukan langganan</p>
        <p className="text-xs text-primary">Klik untuk berlangganan</p>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeElement}
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PremiumBadge;
