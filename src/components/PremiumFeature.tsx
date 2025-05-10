
import { ReactNode, useState } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Info, Check, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { trackPremiumFeatureInteraction } from '@/services/subscriptionAnalyticsService';

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
  
  const isTrialExpired = !isTrialActive && !hasPaidSubscription && organization?.trial_expired === true;

  // Track premium feature interaction
  const handleInteraction = (type: 'view' | 'click' | 'upgrade') => {
    trackPremiumFeatureInteraction({
      featureName,
      interactionType: type,
      organizationId: organization?.id,
      subscriptionStatus: hasPaidSubscription ? 'paid' : isTrialActive ? 'trial' : 'expired'
    });
  };

  // If user has paid subscription or active trial, render children normally
  if (hasPaidSubscription || isTrialActive) {
    // Track that user viewed this premium feature
    handleInteraction('view');
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="premium-feature relative group">
              {children}
              <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-0.5 text-[10px] shadow-sm">
                {isTrialActive ? "⭐" : "✓"}
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
                <>
                  <div className="pt-2 border-t border-blue-50">
                    <div className="flex items-center space-x-1 text-xs text-amber-600">
                      <Info className="h-3 w-3" />
                      <span>
                        Fitur ini tersedia selama masa trial yang berakhir {formattedTrialEndDate || `dalam ${daysLeftInTrial} hari`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-blue-50">
                    <div className="flex items-start space-x-1 text-xs">
                      <div className="mt-0.5">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                      </div>
                      <span className="text-gray-600">
                        Setelah masa trial berakhir, fitur ini hanya tersedia untuk pengguna dengan paket berlangganan.
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-blue-700">Fitur Akan Dibatasi:</span>
                    </div>
                    <ul className="mt-1 space-y-1 text-xs text-gray-600">
                      <li className="flex items-start space-x-1">
                        <div className="mt-0.5">
                          <Check className="h-2.5 w-2.5 text-gray-400" />
                        </div>
                        <span>Hanya versi dasar tersedia</span>
                      </li>
                      <li className="flex items-start space-x-1">
                        <div className="mt-0.5">
                          <Check className="h-2.5 w-2.5 text-gray-400" />
                        </div>
                        <span>Fitur lanjutan tidak tersedia</span>
                      </li>
                    </ul>
                  </div>
                </>
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
          setShowDialog(true);
          handleInteraction('click');
        }}
      >
        <div className="opacity-60 grayscale pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 bg-gray-100 bg-opacity-40 backdrop-blur-[1px] 
                      flex flex-col items-center justify-center rounded-md">
          <Sparkles className="h-8 w-8 text-amber-500 mb-2" />
          <p className="text-sm font-medium text-center px-4">Premium Feature</p>
          <p className="text-xs text-gray-600 text-center px-4 mt-1">
            Mulai berlangganan untuk akses
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 bg-white"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/settings/subscription');
              handleInteraction('upgrade');
            }}
          >
            Berlangganan
          </Button>
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
              <p className="mt-4 pt-3 border-t">
                Fitur ini tersedia selama masa trial atau dengan berlangganan paket Premium.
              </p>
              
              {isTrialExpired && (
                <div className="mt-3 p-2 bg-amber-50 text-amber-700 rounded-md text-sm">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    <span>Masa trial Anda telah berakhir</span>
                  </div>
                </div>
              )}
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
                  handleInteraction('upgrade');
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
