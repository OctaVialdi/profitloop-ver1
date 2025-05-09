
import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useOrganization } from '@/hooks/useOrganization';

interface PremiumFeatureBadgeProps {
  children: ReactNode;
  featureName: string;
  description?: string;
}

/**
 * A badge that highlights premium features in the UI
 */
const PremiumFeatureBadge = ({ 
  children, 
  featureName, 
  description 
}: PremiumFeatureBadgeProps) => {
  const { isTrialActive, hasPaidSubscription } = useOrganization();
  const isAccessible = isTrialActive || hasPaidSubscription;

  return (
    <div className="relative inline-flex group">
      {children}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full p-1 shadow-md">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-3">
          <div className="space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>{featureName}</span>
            </div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            <div className="text-xs pt-1 border-t border-border mt-1">
              {isAccessible ? (
                <span className="text-green-600 font-medium">Fitur Premium Tersedia</span>
              ) : (
                <span className="text-amber-600 font-medium">Berlangganan untuk mengakses fitur ini</span>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default PremiumFeatureBadge;
