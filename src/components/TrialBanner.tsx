
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
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // Skip on auth pages
  const isAuthPage = location.pathname.startsWith('/auth/');
  const isOnboardingPage = location.pathname === '/onboarding' || location.pathname === '/organizations';
  const isSubscriptionPage = location.pathname === '/subscription';
  
  // Update countdown every minute when we have a trial end date
  useEffect(() => {
    if (!trialEndDate || isDismissed || isAuthPage || isOnboardingPage) return;

    const updateCountdown = () => {
      const now = new Date();
      const diffTime = trialEndDate.getTime() - now.getTime();
      
      if (diffTime <= 0) {
        setCountdownString('0 hari 00:00:00');
        setDaysLeft(0);
        setIsTrialExpired(true);
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
      setIsTrialExpired(false);
    };
    
    // Initial update
    updateCountdown();
    
    // Set up interval for updating the countdown (update every 60 seconds instead of every second)
    const interval = setInterval(updateCountdown, 60000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, [trialEndDate, isDismissed, isAuthPage, isOnboardingPage]);
  
  // Get trial information
  useEffect(() => {
    if (isAuthPage || isDismissed || isOnboardingPage) {
      setIsLoading(false);
      return;
    }
    
    const fetchTrialInfo = async () => {
      try {
        setIsLoading(true);
        // Check authentication first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Get organization ID from user metadata (faster than querying profile)
        const orgId = session.user.user_metadata?.organization_id;
        
        if (!orgId) {
          // Try to get from profile as fallback
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('organization_id')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (!profileData?.organization_id) {
              setIsLoading(false);
              return;
            }
            
            setOrganizationId(profileData.organization_id);
            
            // Get organization trial information
            try {
              const { data: orgData } = await supabase
                .from('organizations')
                .select('trial_end_date, trial_expired')
                .eq('id', profileData.organization_id)
                .maybeSingle();
                
              if (!orgData) {
                setIsLoading(false);
                return;
              }
              
              handleTrialData(orgData);
            } catch (error) {
              console.error("Error fetching organization data:", error);
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error fetching profile data:", error);
            setIsLoading(false);
          }
        } else {
          // Use organization ID from metadata
          setOrganizationId(orgId);
          
          // Get organization trial information
          try {
            const { data: orgData } = await supabase
              .from('organizations')
              .select('trial_end_date, trial_expired')
              .eq('id', orgId)
              .maybeSingle();
              
            if (!orgData) {
              setIsLoading(false);
              return;
            }
            
            handleTrialData(orgData);
          } catch (error) {
            console.error("Error fetching organization data:", error);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching trial info:", error);
        setIsLoading(false);
      }
    };
    
    // Function to handle trial data processing
    const handleTrialData = (orgData: any) => {
      // Check if trial has expired based on date
      const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
      const now = new Date();
      const isTrialExpiredByDate = trialEndDate && trialEndDate < now;
      
      if (orgData.trial_expired || isTrialExpiredByDate) {
        setTrialEndDate(trialEndDate);
        setDaysLeft(0);
        setCountdownString('0 hari 00:00:00');
        setIsTrialExpired(true);
        setIsLoading(false);
        
        // Show subscription dialog on non-subscription pages when trial has expired
        if (!isSubscriptionPage) {
          setShowSubscriptionDialog(true);
          
          // Add blur class to body when trial has expired
          document.body.classList.add('trial-expired');
        }
        
        // If the trial is expired by date but not flagged as expired, update the flag
        if (isTrialExpiredByDate && !orgData.trial_expired && organizationId) {
          console.log("Updating trial_expired flag to true");
          
          try {
            const updatePromise = supabase
              .from('organizations')
              .update({ trial_expired: true })
              .eq('id', organizationId);
              
            // Use await instead of .then().catch()
            (async () => {
              try {
                await updatePromise;
                console.log("Trial expired flag updated");
              } catch (err) {
                console.error("Error updating trial expired flag:", err);
              }
            })();
          } catch (err) {
            console.error("Error setting up update promise:", err);
          }
        }
        
        return;
      }
      
      if (trialEndDate) {
        setTrialEndDate(trialEndDate);
        const diffTime = trialEndDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays > 0 ? diffDays : 0);
        setIsTrialExpired(diffDays <= 0);
        setIsLoading(false);
        
        // Trial has ended but not marked as expired yet
        if (diffDays <= 0 && !isSubscriptionPage) {
          setShowSubscriptionDialog(true);
          document.body.classList.add('trial-expired');
          
          // Update the trial_expired flag
          if (organizationId) {
            console.log("Trial has ended, updating trial_expired flag");
            
            try {
              const updatePromise = supabase
                .from('organizations')
                .update({ trial_expired: true })
                .eq('id', organizationId);
                
              // Use await instead of .then().catch()
              (async () => {
                try {
                  await updatePromise;
                  console.log("Trial expired flag updated");
                } catch (err) {
                  console.error("Error updating trial expired flag:", err);
                }
              })();
            } catch (err) {
              console.error("Error setting up update promise:", err);
            }
          }
        }
      } else {
        setIsLoading(false);
      }
    };
    
    // Only fetch trial info once, not on every render
    fetchTrialInfo();
    
    // Cleanup function
    return () => {
      if (isTrialExpired && !isSubscriptionPage) {
        document.body.classList.remove('trial-expired');
      }
    };
  }, [isAuthPage, isDismissed, isOnboardingPage, isSubscriptionPage, organizationId, isTrialExpired]);
  
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
  
  // Don't show anything if not authenticated or on auth pages or if still loading
  if (!isAuthenticated || isAuthPage || isOnboardingPage || isDismissed || daysLeft === null || isLoading) return null;
  
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
    </>
  );
};

export default TrialBanner;

function navigate(path: string): void {
  window.location.href = path;
}

