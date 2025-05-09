import { ReactNode } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const { hasPaidSubscription, isTrialActive } = useOrganization();
  const navigate = useNavigate();

  // If user has paid subscription or active trial, render children normally
  if (hasPaidSubscription || isTrialActive) {
    return (
      <div className="premium-feature">
        {children}
        <div className="premium-tooltip">
          <span className="font-medium">{featureName}</span>
          <br />
          <span className="text-xs text-gray-500">Fitur Premium</span>
        </div>
      </div>
    );
  }

  // Otherwise show placeholder with upgrade dialog
  return (
    <>
      <div 
        className="premium-feature cursor-pointer" 
        onClick={() => setShowDialog(true)}
      >
        {children}
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
                onClick={() => navigate('/settings/subscription')} 
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
