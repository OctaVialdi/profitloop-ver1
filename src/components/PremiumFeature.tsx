
import { ReactNode, useState } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { subscriptionAnalyticsService } from '@/services/subscriptionAnalyticsService';
import PremiumBadge from './subscription/PremiumBadge';

interface PremiumFeatureProps {
  children: ReactNode;
  featureName: string; 
  description?: string;
}

/**
 * Wrap premium features with this component to show tooltip and handle expired trial
 */
const PremiumFeature = ({ children, featureName, description }: PremiumFeatureProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const { hasPaidSubscription, isTrialActive, daysLeftInTrial, organization } = useOrganization();
  const navigate = useNavigate();

  // Format trial end date if available
  const formattedTrialEndDate = organization?.trial_end_date ? 
    format(new Date(organization.trial_end_date), 'd MMMM yyyy', { locale: idLocale }) : null;

  // If user has paid subscription or active trial, render children normally
  if (hasPaidSubscription || isTrialActive) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="premium-feature relative group">
              {children}
              <div className="absolute -top-1 -right-1">
                <PremiumBadge featureName={featureName} size="sm" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            align="center"
            className="w-72 p-3 bg-white border-blue-100 shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-700">{featureName}</span>
                {isTrialActive ? (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    Trial Preview
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              
              {description && <p className="text-sm text-gray-600">{description}</p>}
              
              {isTrialActive && (
                <div className="pt-2 border-t border-blue-50">
                  <div className="flex items-center space-x-1 text-xs text-amber-600">
                    <Info className="h-3 w-3" />
                    <span>
                      Fitur ini tersedia selama masa trial yang berakhir {formattedTrialEndDate || `dalam ${daysLeftInTrial} hari`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Otherwise show placeholder with upgrade dialog
  return (
    <>
      <div 
        className="premium-feature cursor-pointer relative" 
        onClick={() => {
          // Track premium feature click
          subscriptionAnalyticsService.trackPremiumFeatureClicked(featureName, organization?.id);
          setShowDialog(true);
        }}
      >
        {children}
        <div className="absolute -top-1 -right-1">
          <PremiumBadge featureName={featureName} size="sm" />
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            
            <DialogTitle className="text-xl">Fitur Premium</DialogTitle>
            <DialogDescription className="mt-2 mb-4">
              <strong>{featureName}</strong> adalah fitur premium.
              {description && <p className="mt-2">{description}</p>}
              <p className="mt-2">Berlangganan untuk mengakses fitur ini dan semua fitur premium lainnya.</p>
            </DialogDescription>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full">
              <Button 
                onClick={() => setShowDialog(false)} 
                variant="outline" 
                className="w-full sm:w-auto"
              >
                Nanti Saja
              </Button>
              <Button 
                onClick={() => {
                  navigate('/settings/subscription');
                  subscriptionAnalyticsService.trackEvent({
                    eventType: 'premium_feature_clicked',
                    organizationId: organization?.id,
                    additionalData: { 
                      featureName,
                      action: 'navigate_to_subscription' 
                    }
                  });
                }} 
                className="w-full sm:w-auto"
              >
                Berlangganan Sekarang
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumFeature;
