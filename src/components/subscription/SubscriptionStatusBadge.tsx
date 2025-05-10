
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useOrganization } from '@/hooks/useOrganization';
import { Clock, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface SubscriptionStatusBadgeProps {
  className?: string;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SubscriptionStatusBadge = ({ 
  className, 
  showTooltip = true,
  size = 'md'
}: SubscriptionStatusBadgeProps) => {
  const { 
    isTrialActive, 
    daysLeftInTrial, 
    hasPaidSubscription,
    organization,
    subscriptionPlan
  } = useOrganization();

  // Define size classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  // Determine status
  const getStatusInfo = () => {
    if (hasPaidSubscription) {
      return {
        label: `${subscriptionPlan?.name || 'Premium'}`,
        variant: 'success' as const,
        icon: CheckCircle,
        tooltip: 'Langganan aktif',
        details: organization?.subscription_plan_id 
          ? `Anda berlangganan paket ${subscriptionPlan?.name}.` 
          : 'Langganan aktif'
      };
    }
    
    if (isTrialActive) {
      return {
        label: `Trial (${daysLeftInTrial} hari)`,
        variant: 'default' as const,
        icon: Clock,
        tooltip: 'Masa uji coba',
        details: organization?.trial_end_date 
          ? `Masa uji coba berakhir pada ${format(new Date(organization.trial_end_date), 'd MMMM yyyy', { locale: idLocale })}.` 
          : `Masa uji coba berakhir dalam ${daysLeftInTrial} hari.`
      };
    }
    
    return {
      label: 'Expired',
      variant: 'destructive' as const,
      icon: AlertTriangle,
      tooltip: 'Masa uji coba habis',
      details: 'Masa uji coba Anda telah habis. Silakan berlangganan untuk terus menggunakan fitur premium.'
    };
  };
  
  const statusInfo = getStatusInfo();
  
  const StatusIcon = statusInfo.icon;
  
  const badgeElement = (
    <Badge 
      variant={statusInfo.variant}
      className={cn(
        "flex items-center gap-1 font-medium", 
        sizeClasses[size],
        className
      )}
    >
      <StatusIcon className={cn("h-3 w-3", size === 'lg' && "h-4 w-4")} />
      <span>{statusInfo.label}</span>
    </Badge>
  );
  
  if (!showTooltip) {
    return badgeElement;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeElement}
        </TooltipTrigger>
        <TooltipContent className="p-3 max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">{statusInfo.tooltip}</p>
            <p className="text-sm text-muted-foreground">{statusInfo.details}</p>
            
            {!hasPaidSubscription && (
              <p className="text-xs text-foreground mt-2 pt-2 border-t border-border">
                Berlangganan untuk mengakses semua fitur premium.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SubscriptionStatusBadge;
