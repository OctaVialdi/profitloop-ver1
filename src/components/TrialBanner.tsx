import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CalendarClock, X, Timer, CreditCard, ShieldAlert } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { useOrganization } from '@/hooks/useOrganization';

const TrialBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [hours, setHours] = useState<number | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [isLastThreeDays, setIsLastThreeDays] = useState(false);
  const location = useLocation();
  
  const { 
    isTrialActive, 
    isTrialExpired, 
    daysLeftInTrial, 
    hasPaidSubscription,
    organization 
  } = useOrganization();
  
  // Skip on auth pages and subscription page
  const isAuthPage = location.pathname.startsWith('/auth/');
  const isOnboardingPage = location.pathname === '/onboarding' || location.pathname === '/organizations';
  const isSubscriptionPage = location.pathname === '/subscription' || location.pathname === '/settings/subscription';
  
  // Update countdown timer for last 3 days
  useEffect(() => {
    if (isDismissed || !isTrialActive || !organization?.trial_end_date || daysLeftInTrial > 3) {
      setIsLastThreeDays(false);
      return;
    }
    
    setIsLastThreeDays(daysLeftInTrial <= 3);
    
    if (daysLeftInTrial <= 3) {
      const updateCountdown = () => {
        const now = new Date();
        const endDate = new Date(organization.trial_end_date!);
        const diffTime = endDate.getTime() - now.getTime();
        
        if (diffTime <= 0) {
          setHours(0);
          setMinutes(0);
          setSeconds(0);
          return;
        }
        
        // Calculate hours, minutes, seconds
        const hoursLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((diffTime % (1000 * 60)) / 1000);
        
        setHours(hoursLeft);
        setMinutes(minutesLeft);
        setSeconds(secondsLeft);
      };
      
      // Initial update
      updateCountdown();
      
      // Update every second for the last 3 days
      const interval = setInterval(updateCountdown, 1000);
      
      return () => clearInterval(interval);
    }
  }, [organization?.trial_end_date, isTrialActive, daysLeftInTrial, isDismissed]);
  
  // Trigger the subscription dialog when trial expires
  useEffect(() => {
    if (isTrialExpired && !isSubscriptionPage && !isAuthPage && !isOnboardingPage) {
      setShowSubscriptionDialog(true);
      document.body.classList.add('trial-expired');
    }
    
    return () => {
      document.body.classList.remove('trial-expired');
    };
  }, [isTrialExpired, isSubscriptionPage, isAuthPage, isOnboardingPage]);
  
  // Handle subscription navigation
  const handleSubscribe = () => {
    navigate("/subscription");
    setShowSubscriptionDialog(false);
    document.body.classList.remove('trial-expired');
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth/login");
    document.body.classList.remove('trial-expired');
  };
  
  // Don't show anything if not trial active or on certain pages
  if (hasPaidSubscription || isAuthPage || isOnboardingPage || isDismissed || 
      (!isTrialActive && !isTrialExpired) || isSubscriptionPage) {
    return null;
  }
  
  // Format the time remaining for display
  const formatTimeUnit = (unit: number | null) => {
    if (unit === null) return '00';
    return unit.toString().padStart(2, '0');
  };
  
  return (
    <>
      {isTrialActive && isLastThreeDays && (
        <Alert className="sticky top-0 z-50 rounded-none border-b mb-0 py-2 px-4 flex items-center justify-between bg-blue-50 border-blue-100">
          <div className="flex items-center flex-grow">
            <CalendarClock className="h-4 w-4 text-blue-600 mr-2 shrink-0" />
            <div className="flex flex-col md:flex-row md:items-center w-full">
              <AlertDescription className="text-blue-700 font-medium text-sm mr-2">
                Masa trial Anda akan berakhir dalam:
              </AlertDescription>
              <div className="font-bold text-blue-800 flex items-center">
                {daysLeftInTrial > 0 ? (
                  <span>{daysLeftInTrial} hari</span>
                ) : (
                  <div className="countdown-timer flex items-center">
                    <span>{formatTimeUnit(hours)}</span>
                    <span className="mx-1">:</span>
                    <span>{formatTimeUnit(minutes)}</span>
                    <span className="mx-1">:</span>
                    <span>{formatTimeUnit(seconds)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="default" 
              className="h-8 bg-blue-700 hover:bg-blue-800"
              onClick={() => navigate("/subscription")}
            >
              <CreditCard className="h-3.5 w-3.5 mr-1" />
              Berlangganan
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsDismissed(true)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      )}
      
      {/* Display progress bar for last 3 days only */}
      {isTrialActive && isLastThreeDays && (
        <div className="h-1 w-full bg-gray-100">
          <Progress 
            value={((3 - Math.min(daysLeftInTrial, 3)) / 3) * 100} 
            className="h-1 transition-all duration-500"
          />
        </div>
      )}
      
      {/* Fullscreen Subscription Modal for expired trial */}
      <Sheet open={showSubscriptionDialog && !isSubscriptionPage} onOpenChange={setShowSubscriptionDialog}>
        <SheetContent side="bottom" className="w-full sm:max-w-md mx-auto h-auto max-h-[90vh] rounded-t-lg bg-white shadow-lg p-0">
          <div className="flex flex-col items-center p-6">
            {/* Warning Icon */}
            <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <ShieldAlert className="w-14 h-14 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2">
              Masa trial Anda telah berakhir
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Upgrade sekarang untuk membuka semua fitur premium dan melanjutkan perjalanan Anda bersama kami.
            </p>
            
            <div className="w-full space-y-4">
              <Button 
                className="w-full py-6 text-base font-medium bg-[#9b87f5] hover:bg-[#8a72f3]"
                onClick={handleSubscribe}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Upgrade Sekarang
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full py-6 text-base font-medium"
                onClick={handleSignOut}
              >
                Keluar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Blocking dialog for pages when trial has ended */}
      <Dialog open={isTrialExpired && !isSubscriptionPage} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center p-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-10 h-10 text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-center mb-2">
              Akses Terbatas
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Masa trial Anda telah berakhir. Untuk melanjutkan akses ke semua fitur, silakan berlangganan.
            </p>
            
            <DialogFooter className="w-full flex flex-col gap-2">
              <Button 
                className="w-full bg-[#9b87f5] hover:bg-[#8a72f3]"
                onClick={handleSubscribe}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Berlangganan Sekarang
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleSignOut}
              >
                Keluar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrialBanner;

function navigate(path: string): void {
  window.location.href = path;
}
