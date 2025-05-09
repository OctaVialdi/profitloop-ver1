
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { robustSignOut } from '@/utils/authUtils';
import { useEffect, useState } from "react";
import TrialExtensionRequestForm from "./TrialExtensionRequestForm";
import { supabase } from '@/integrations/supabase/client';

interface TrialExpiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

const TrialExpiredModal = ({
  open,
  onOpenChange,
  organizationId
}: TrialExpiredModalProps) => {
  const navigate = useNavigate();
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // Get user email
  useEffect(() => {
    const getUserEmail = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    };
    
    getUserEmail();
  }, []);
  
  const handleSignOut = async () => {
    await robustSignOut();
    navigate("/auth/login");
  };
  
  const handleUpgrade = () => {
    navigate("/settings/subscription");
    onOpenChange(false);
  };
  
  const handleExtensionSuccess = () => {
    setShowExtensionForm(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!showExtensionForm ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
            
            <h2 className="text-xl font-bold mb-3">
              Masa Trial Anda Telah Berakhir
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Untuk melanjutkan menggunakan semua fitur premium, silakan upgrade langganan Anda sekarang.
            </p>
            
            <div className="flex flex-col w-full gap-3">
              <Button 
                className="w-full"
                onClick={handleUpgrade}
              >
                Upgrade Sekarang
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowExtensionForm(true)}
              >
                Minta Perpanjangan Trial
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full mt-2 text-muted-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4 text-center">
              Minta Perpanjangan Trial
            </h2>
            
            <TrialExtensionRequestForm 
              organizationId={organizationId}
              onSuccess={handleExtensionSuccess}
              onCancel={() => setShowExtensionForm(false)}
              userEmail={userEmail}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrialExpiredModal;
