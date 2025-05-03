import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CalendarClock, X, Timer } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const TrialBanner = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [countdownString, setCountdownString] = useState<string>('');
  const [isDismissed, setIsDismissed] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const location = useLocation();
  
  // Skip on auth pages
  const isAuthPage = location.pathname.startsWith('/auth/');
  const isOnboardingPage = location.pathname === '/onboarding';
  const isSubscriptionPage = location.pathname === '/subscription';
  
  // Force check trial expiration status immediately on mount
  useEffect(() => {
    if (isAuthPage || isOnboardingPage || isSubscriptionPage) return;
    
    // Set a flag to track if this is the first run to avoid multiple setTimeouts
    let isFirstRun = true;
    
    const checkTrialExpiration = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Get user's organization
        const { data: profileData } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (!profileData?.organization_id) return;
        
        setOrganizationId(profileData.organization_id);
        
        // Get organization details
        const { data: orgData } = await supabase
          .from('organizations')
          .select('trial_end_date, trial_expired')
          .eq('id', profileData.organization_id)
          .maybeSingle();
          
        if (!orgData) return;
        
        // Set trial end date
        const endDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
        setTrialEndDate(endDate);
        
        // Check if trial has expired
        const now = new Date();
        const isExpiredByDate = endDate && endDate <= now; 
        const isExpiredByFlag = orgData.trial_expired === true;
        
        console.log("Trial expiration check:", {
          endDate, 
          now,
          isExpiredByDate,
          isExpiredByFlag,
          isPastTrialDate: endDate && now > endDate
        });
        
        // If trial is expired by date but not by flag, update the flag
        if (isExpiredByDate && !isExpiredByFlag) {
          console.log("Trial is expired by date but not by flag, updating...");
          await supabase
            .from('organizations')
            .update({ trial_expired: true })
            .eq('id', profileData.organization_id);
            
          // Also trigger the edge function to process trial expiration
          try {
            await supabase.functions.invoke('check-trial-expiration');
          } catch (err) {
            console.error("Failed to invoke check-trial-expiration:", err);
          }
        }
        
        // If trial is expired (by date or flag), show expiry dialog and apply blur
        if (isExpiredByDate || isExpiredByFlag) {
          setIsTrialExpired(true);
          setDaysLeft(0);
          setCountdownString('0 hari 00:00:00');
          
          if (!isSubscriptionPage) {
            setShowSubscriptionDialog(true);
            document.body.classList.add('trial-expired');
          }
        } else if (endDate) {
          // Trial not expired, calculate days left
          const diffTime = endDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysLeft(diffDays > 0 ? diffDays : 0);
          setIsTrialExpired(false);
        }
        
        // If this is first run and we're not on a special page and the trial is active, 
        // set up the countdown interval
        if (isFirstRun && !isAuthPage && !isOnboardingPage && !isTrialExpired) {
          isFirstRun = false;
          startCountdown();
        }
      } catch (error) {
        console.error("Error checking trial expiration:", error);
      }
    };
    
    // Start countdown timer
    const startCountdown = () => {
      if (!trialEndDate) return;
      
      const updateCountdown = () => {
        if (!trialEndDate) return;
        
        const now = new Date();
        const diffTime = trialEndDate.getTime() - now.getTime();
        
        if (diffTime <= 0) {
          setCountdownString('0 hari 00:00:00');
          setDaysLeft(0);
          setIsTrialExpired(true);
          
          // Immediately apply blur effect and show modal when countdown reaches zero
          if (!isSubscriptionPage) {
            setShowSubscriptionDialog(true);
            document.body.classList.add('trial-expired');
          }
          return;
        }
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
        
        // Format as "X hari HH:MM:SS"
        const formattedTime = `${days} hari ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setCountdownString(formattedTime);
        setDaysLeft(days);
      };
      
      // Initial update
      updateCountdown();
      
      // Set interval for countdown
      const interval = setInterval(updateCountdown, 1000);
      
      return () => clearInterval(interval);
    };
    
    // Initial check on mount
    checkTrialExpiration();
    
    // Check again every minute in case the trial expires while using the app
    const intervalCheck = setInterval(checkTrialExpiration, 60000);
    
    return () => {
      clearInterval(intervalCheck);
      if (isTrialExpired && !isSubscriptionPage) {
        document.body.classList.remove('trial-expired');
      }
    };
  }, [isAuthPage, isOnboardingPage, isSubscriptionPage]);
  
  // Handle subscription navigation
  const handleSubscribe = () => {
    navigate("/subscription");
    setShowSubscriptionDialog(false);
    // Remove blur when navigating to subscription page
    document.body.classList.remove('trial-expired');
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth/login");
    document.body.classList.remove('trial-expired');
  };
  
  // Don't show anything if not authenticated or on auth pages
  if (!isAuthenticated || isAuthPage || isOnboardingPage || isDismissed || daysLeft === null) return null;
  
  return (
    <>
      {!isTrialExpired && (
        <Alert className="sticky top-0 z-50 rounded-none border-b mb-0 py-2 px-4 flex items-center justify-between bg-blue-50 border-blue-100">
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 text-blue-600 mr-2" />
            <AlertDescription className="text-blue-700 font-medium text-sm">
              {daysLeft > 0 ? (
                <>Masa trial Anda berakhir dalam <span className="font-semibold">{countdownString}</span>. </>
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
      )}
      
      {/* Fullscreen Subscription Modal - Using the "bottom" side and custom styling to center it */}
      <Sheet open={isTrialExpired && showSubscriptionDialog && !isSubscriptionPage} onOpenChange={setShowSubscriptionDialog}>
        <SheetContent side="bottom" className="w-full sm:max-w-md mx-auto h-auto max-h-[90vh] rounded-t-lg bg-white shadow-lg p-0">
          <div className="flex flex-col items-center p-6">
            {/* Timer Icon */}
            <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Timer className="w-14 h-14 text-blue-600" />
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
      
      {/* Legacy Dialog - keep as fallback if Sheet doesn't work */}
      <Dialog open={false && isTrialExpired && showSubscriptionDialog && !isSubscriptionPage} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Masa trial Anda telah berakhir</DialogTitle>
            <DialogDescription>
              Terima kasih telah mencoba layanan kami. Untuk terus menikmati semua fitur, silakan berlangganan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Berlangganan sekarang untuk mendapatkan:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Akses penuh ke semua fitur</li>
              <li>Dukungan premium</li>
              <li>Pembaruan dan perbaikan rutin</li>
              <li>Tidak ada gangguan pada alur kerja Anda</li>
            </ul>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={handleSignOut}
            >
              Keluar
            </Button>
            <Button onClick={handleSubscribe}>
              Lihat Paket Langganan
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
