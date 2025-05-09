
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface TrialProtectionProps {
  children: ReactNode;
  requiredSubscription?: boolean;
}

const ALLOWED_PATHS = ['/subscription', '/settings/subscription', '/auth/login'];

const TrialProtection = ({ children, requiredSubscription = false }: TrialProtectionProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const { hasPaidSubscription, organization, isLoading } = useOrganization();
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
    } else {
      setShowDialog(false);
    }
  }, [blockAccess, location.pathname]);
  
  // Navigate to subscription page
  const handleUpgrade = () => {
    navigate('/subscription');
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
            </DialogDescription>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full">
              <Button 
                onClick={() => setShowDialog(false)} 
                variant="outline" 
                className="w-full sm:w-auto"
              >
                Kembali
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
