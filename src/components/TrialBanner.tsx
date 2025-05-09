
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CalendarClock, X, Timer, HelpCircle } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import TrialExtensionRequestDialog from './trial/TrialExtensionRequestDialog';
import { trackSubscriptionEvent } from '@/utils/subscriptionUtils';

const TrialBanner = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [countdownString, setCountdownString] = useState<string>('');
  const [isDismissed, setIsDismissed] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progressPercent, setProgressPercent] = useState(100);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [isPulsing, setIsPulsing] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Skip on auth pages
  const isAuthPage = location.pathname.startsWith('/auth/');
  const isOnboardingPage = location.pathname === '/onboarding' || location.pathname === '/organizations';
  const isSubscriptionPage = location.pathname === '/subscription' || location.pathname.includes('/settings/subscription');
  
  // Track user engagement with trial banner
  const trackBannerEvent = async (action: string) => {
    if (organizationId) {
      await trackSubscriptionEvent(`trial_banner_${action}`, organizationId);
    }
  };

  // Handle successful trial extension request
  const handleExtensionRequestSuccess = () => {
    toast.success("Permintaan perpanjangan trial telah dikirim ke tim kami");
    if (isTrialExpired) {
      // Close subscription dialog if it was open
      setShowSubscriptionDialog(false);
    }
    // Track the event
    trackBannerEvent('extension_requested');
  };
  
  // Update countdown every second when we have a trial end date
  useEffect(() => {
    if (!trialEndDate || isDismissed || isAuthPage || isOnboardingPage) return;

    const updateCountdown = () => {
      const now = new Date();
      const diffTime = trialEndDate.getTime() - now.getTime();
      
      // Calculate total trial days (assuming 14 days)
      const trialStartDate = new Date(trialEndDate.getTime() - (14 * 24 * 60 * 60 * 1000));
      const totalTrialTime = trialEndDate.getTime() - trialStartDate.getTime();
      const elapsedTime = now.getTime() - trialStartDate.getTime();
      
      // Calculate progress percentage (reversed - starts at 100, goes to 0)
      const calculatedProgress = 100 - Math.min(100, Math.max(0, (elapsedTime / totalTrialTime) * 100));
      setProgressPercent(calculatedProgress);
      
      if (diffTime <= 0) {
        setCountdownString('0 hari 00:00:00');
        setDaysLeft(0);
        setSecondsLeft(0);
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
      setSecondsLeft(Math.floor(diffTime / 1000));
      setIsTrialExpired(false);
      
      // Enable pulsing effect for last 24 hours
      setIsPulsing(days === 0);
    };
    
    // Initial update
    updateCountdown();
    
    // Set up interval for updating the countdown every second for a more dynamic experience
    const interval = setInterval(updateCountdown, 1000);
    
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
          
          // Track the expired trial view event
          trackBannerEvent('expired_view');
        }
        
        // If the trial is expired by date but not flagged as expired, update the flag
        if (isTrialExpiredByDate && !orgData.trial_expired && organizationId) {
          console.log("Updating trial_expired flag to true");
          
          try {
            // Using async/await with try/catch instead of Promise.catch()
            (async () => {
              try {
                await supabase
                  .from('organizations')
                  .update({ trial_expired: true })
                  .eq('id', organizationId);
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
        
        // Track banner view for active trial
        if (diffDays <= 3) {
          trackBannerEvent('active_view');
        }
        
        // Trial has ended but not marked as expired yet
        if (diffDays <= 0 && !isSubscriptionPage) {
          setShowSubscriptionDialog(true);
          document.body.classList.add('trial-expired');
          
          // Track expired view
          trackBannerEvent('expired_view');
          
          // Update the trial_expired flag
          if (organizationId) {
            console.log("Trial has ended, updating trial_expired flag");
            
            // Using async/await with try/catch instead of Promise.catch()
            (async () => {
              try {
                await supabase
                  .from('organizations')
                  .update({ trial_expired: true })
                  .eq('id', organizationId);
                console.log("Trial expired flag updated");
              } catch (err) {
                console.error("Error updating trial expired flag:", err);
              }
            })();
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
    // Track the click event
    trackBannerEvent('upgrade_click');
    navigate("/settings/subscription");
    setShowSubscriptionDialog(false);
    // Remove blur when navigating to subscription page
    document.body.classList.remove('trial-expired');
  };

  // Handle sign out
  const handleSignOut = async () => {
    // Track the sign out event
    trackBannerEvent('signout_click');
    await supabase.auth.signOut();
    navigate("/auth/login");
    document.body.classList.remove('trial-expired');
  };
  
  // Helper function to get color class based on days left
  const getProgressColorClass = () => {
    if (daysLeft === null) return 'bg-blue-600';
    if (daysLeft <= 1) return 'trial-progress-low';
    if (daysLeft <= 3) return 'trial-progress-medium';
    return 'trial-progress-high';
  };

  // Format seconds for display
  const formatTimeRemaining = () => {
    if (secondsLeft <= 0) return "Waktu habis";
    
    const days = Math.floor(secondsLeft / (60 * 60 * 24));
    const hours = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((secondsLeft % (60 * 60)) / 60);
    const seconds = secondsLeft % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  // Don't show anything if not authenticated or on auth pages or if still loading
  if (!isAuthenticated || isAuthPage || isOnboardingPage || isDismissed || daysLeft === null || isLoading) return null;
  
  const bannerBackgroundColor = daysLeft <= 1 ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'; 
  const progressColor = getProgressColorClass();
  
  return (
    <>
      {!isTrialExpired && daysLeft <= 3 && (
        <Alert className={`sticky top-0 z-50 rounded-none border-b mb-0 py-2 px-4 animate-in fade-in duration-300 ${bannerBackgroundColor}`}>
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CalendarClock className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                <AlertDescription className="text-blue-700 font-medium text-sm">
                  {daysLeft > 0 ? (
                    <>Masa trial Anda berakhir dalam </>
                  ) : (
                    <>Masa trial Anda hampir berakhir</>
                  )}
                </AlertDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-blue-700 underline font-semibold text-sm"
                  onClick={() => {
                    trackBannerEvent('upgrade_click');
                    navigate("/settings/subscription");
                  }}
                >
                  Berlangganan
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                  setIsDismissed(true);
                  trackBannerEvent('dismiss_click');
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className={`text-center font-mono ${isPulsing ? 'trial-countdown' : ''}`}>
              <span className="font-bold text-lg">
                {formatTimeRemaining()}
              </span>
            </div>
            
            <div className="w-full">
              <Progress 
                value={progressPercent} 
                className={`h-2 ${progressColor}`}
              />
            </div>
          </div>
        </Alert>
      )}
      
      {/* Fullscreen Subscription Modal with Enhanced UI */}
      <Sheet open={isTrialExpired && showSubscriptionDialog && !isSubscriptionPage} onOpenChange={setShowSubscriptionDialog}>
        <SheetContent side="bottom" className="w-full sm:max-w-md mx-auto h-auto max-h-[90vh] rounded-t-lg bg-white shadow-lg p-0 animate-in slide-in-from-bottom duration-500">
          <div className="flex flex-col items-center p-6 relative">
            {/* Added animated background accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 rounded-t-lg animate-pulse"></div>
            
            {/* Timer Icon with enhanced styling */}
            <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-4 border-red-100 animate-pulse">
              <Timer className="w-14 h-14 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2">
              Masa trial Anda telah berakhir
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Upgrade sekarang untuk membuka semua fitur premium dan melanjutkan perjalanan Anda bersama kami.
            </p>
            
            <div className="w-full space-y-4">
              <Button 
                className="w-full py-6 text-base font-medium bg-[#9b87f5] hover:bg-[#8a72f3] animate-pulse"
                onClick={handleSubscribe}
              >
                Upgrade Sekarang
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full py-6 text-base font-medium"
                onClick={() => setShowExtensionDialog(true)}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Minta Perpanjangan Trial
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

      {/* Trial Extension Request Dialog */}
      <TrialExtensionRequestDialog 
        open={showExtensionDialog} 
        onOpenChange={setShowExtensionDialog}
        onSuccessfulRequest={handleExtensionRequestSuccess}
      />
    </>
  );
};

export default TrialBanner;
