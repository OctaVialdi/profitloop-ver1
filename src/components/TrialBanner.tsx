
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CalendarClock, X } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const TrialBanner = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const location = useLocation();
  
  // Skip on auth pages
  const isAuthPage = location.pathname.startsWith('/auth/');
  
  // Get trial information
  useEffect(() => {
    if (isAuthPage || isDismissed) return;
    
    const fetchTrialInfo = async () => {
      // Get current user organization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return;
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .single();
        
      if (!profileData?.organization_id) return;
      
      setOrganizationId(profileData.organization_id);
      
      // Get organization trial information
      const { data: orgData } = await supabase
        .from('organizations')
        .select('trial_end_date, trial_expired')
        .eq('id', profileData.organization_id)
        .single();
        
      if (!orgData) {
        return;
      }
      
      if (orgData.trial_expired) {
        setDaysLeft(0);
        // Show subscription dialog on non-auth pages when trial has expired
        setShowSubscriptionDialog(true);
        return;
      }
      
      if (orgData.trial_end_date) {
        const endDate = new Date(orgData.trial_end_date);
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays > 0 ? diffDays : 0);
        
        if (diffDays <= 0) {
          // Trial has ended but not marked as expired yet
          setShowSubscriptionDialog(true);
        }
      }
    };
    
    fetchTrialInfo();
  }, [isAuthPage, isDismissed]);
  
  // Handle subscription navigation
  const handleSubscribe = () => {
    navigate("/subscription");
    setShowSubscriptionDialog(false);
  };
  
  if (isAuthPage || isDismissed || daysLeft === null || daysLeft > 14) return null;
  
  return (
    <>
      <Alert className="sticky top-0 z-50 rounded-none border-b mb-0 py-2 px-4 flex items-center justify-between bg-blue-50 border-blue-100">
        <div className="flex items-center">
          <CalendarClock className="h-4 w-4 text-blue-600 mr-2" />
          <AlertDescription className="text-blue-700 font-medium text-sm">
            {daysLeft > 0 ? (
              <>Masa trial Anda berakhir dalam <span className="font-semibold">{daysLeft} hari</span>. </>
            ) : (
              <>Masa trial Anda telah berakhir. </>
            )}
            <Button 
              variant="link" 
              className="h-auto p-0 text-blue-700 underline font-semibold text-sm"
              onClick={() => navigate("/subscription")}
            >
              Berlangganan sekarang
            </Button>
          </AlertDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsDismissed(true)}>
          <X className="h-4 w-4" />
        </Button>
      </Alert>
      
      {/* Subscription Dialog */}
      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your trial has ended</DialogTitle>
            <DialogDescription>
              Thank you for trying our service. To continue enjoying all features and functionalities,
              please subscribe to one of our plans.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Subscribe now to unlock:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Full access to all features</li>
              <li>Premium support</li>
              <li>Regular updates and improvements</li>
              <li>No disruption to your workflows</li>
            </ul>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSubscriptionDialog(false)}
            >
              Later
            </Button>
            <Button onClick={handleSubscribe}>
              View Subscription Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrialBanner;

function navigate(path: string): void {
  window.location.href = path;
}
