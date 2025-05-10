
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { trackAnalyticsEvent } from '@/services/subscriptionAnalyticsService';

interface TrialProtectionProps {
  children: ReactNode;
  requiredSubscription?: boolean;
}

const ALLOWED_PATHS = ['/subscription', '/settings/subscription', '/auth/login', '/trial-expired'];

const TrialProtection = ({ children, requiredSubscription = false }: TrialProtectionProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const { hasPaidSubscription, organization, isLoading, isTrialActive } = useOrganization();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if current path is allowed without subscription
  const isAllowedPath = ALLOWED_PATHS.some(path => location.pathname.startsWith(path));
  
  // Determine if access should be blocked
  const blockAccess = 
    !isLoading && 
    requiredSubscription && 
    !hasPaidSubscription && 
    organization?.subscription_status === 'expired' && 
    !isAllowedPath;
  
  // Effect to show dialog when access should be blocked
  useEffect(() => {
    if (blockAccess) {
      setShowDialog(true);
      
      // Add blur to page content when trial expired
      document.body.classList.add('trial-expired');
      
      // Track analytics event
      if (organization?.id) {
        trackAnalyticsEvent({
          organizationId: organization.id,
          eventType: 'premium_feature_blocked',
          eventData: {
            path: location.pathname
          }
        });
      }
    } else {
      setShowDialog(false);
      document.body.classList.remove('trial-expired');
    }
    
    return () => {
      // Clean up blur class when component unmounts
      document.body.classList.remove('trial-expired');
    };
  }, [blockAccess, location.pathname, organization]);
  
  // Navigate to subscription page
  const handleUpgrade = () => {
    // Track analytics event
    if (organization?.id) {
      trackAnalyticsEvent({
        organizationId: organization.id,
        eventType: 'upgrade_button_click',
        eventData: {
          source: 'trial_protection_dialog',
          path: location.pathname
        }
      });
    }
    
    navigate('/settings/subscription');
    setShowDialog(false);
  };

  // Navigate to trial expired page
  const handleRedirectToTrialExpired = () => {
    // Track analytics event
    if (organization?.id) {
      trackAnalyticsEvent({
        organizationId: organization.id,
        eventType: 'trial_expired_redirect',
        eventData: {
          from_path: location.pathname
        }
      });
    }
    
    navigate('/trial-expired');
    setShowDialog(false);
  };
  
  return (
    <>
      {children}
      
      {/* Blocking dialog for expired trial */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
            
            <DialogTitle className="text-xl">Fitur Premium</DialogTitle>
            <DialogDescription className="mt-2 mb-4">
              Fitur ini hanya tersedia untuk pelanggan premium. Masa trial Anda telah berakhir.
              Silakan upgrade langganan Anda untuk mengakses fitur ini.
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border text-sm text-left">
                <strong className="block text-gray-700 mb-1">Fitur yang dibatasi:</strong>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Analytics Dashboard</li>
                  <li>Financial Reports</li>
                  <li>AI Recommendations</li>
                  <li>Operational Metrics</li>
                </ul>
              </div>
            </DialogDescription>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full">
              <Button 
                onClick={handleRedirectToTrialExpired} 
                variant="outline" 
                className="w-full sm:w-auto"
              >
                Lihat Pilihan Paket
              </Button>
              <Button 
                onClick={handleUpgrade} 
                className="w-full sm:w-auto"
              >
                Upgrade Sekarang
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrialProtection;
