import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CalendarClock, X, AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { checkAndUpdateTrialStatus } from '@/services/subscriptionService';
import { subscriptionAnalyticsService } from '@/services/subscriptionAnalyticsService';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { robustSignOut } from '@/utils/authUtils';

const TrialBanner = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [countdownString, setCountdownString] = useState<string>('');
  const [isDismissed, setIsDismissed] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(100);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Skip on auth pages
  const isAuthPage = location.pathname.startsWith('/auth/');
  const isOnboardingPage = location.pathname === '/onboarding' || location.pathname === '/organizations';
  const isSubscriptionPage = location.pathname === '/subscription' || location.pathname === '/settings/subscription';
  
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
      setIsTrialExpired(days <= 0);
      
      // Calculate progress percentage if trial start date is available
      if (trialStartDate) {
        const totalTrialTime = trialEndDate.getTime() - trialStartDate.getTime();
        const elapsedTime = now.getTime() - trialStartDate.getTime();
        const remainingPercentage = Math.max(0, Math.min(100, 100 - (elapsedTime / totalTrialTime * 100)));
        setProgress(remainingPercentage);
      }
    };
    
    // Initial update
    updateCountdown();
    
    // Set up interval for updating the countdown (update every minute)
    const interval = setInterval(updateCountdown, 60000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, [trialEndDate, trialStartDate, isDismissed, isAuthPage, isOnboardingPage]);
  
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
            await fetchOrganizationData(profileData.organization_id);
          } catch (error) {
            console.error("Error fetching profile data:", error);
            setIsLoading(false);
          }
        } else {
          // Use organization ID from metadata
          setOrganizationId(orgId);
          
          // Get organization trial information
          await fetchOrganizationData(orgId);
        }
      } catch (error) {
        console.error("Error fetching trial info:", error);
        setIsLoading(false);
      }
    };
    
    const fetchOrganizationData = async (orgId: string) => {
      try {
        // Force check and update trial status first to ensure we have the latest status
        await checkAndUpdateTrialStatus(orgId);
        
        const { data: orgData } = await supabase
          .from('organizations')
          .select('trial_end_date, trial_expired, trial_start_date, subscription_status')
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
    };
    
    // Function to handle trial data processing
    const handleTrialData = (orgData: any) => {
      // Process trial start and end dates
      const trialStartDate = orgData.trial_start_date ? new Date(orgData.trial_start_date) : null;
      const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
      const now = new Date();
      
      setTrialStartDate(trialStartDate);
      setTrialEndDate(trialEndDate);
      setSubscriptionStatus(orgData.subscription_status);
      
      const isExpired = orgData.trial_expired || 
                       (trialEndDate && trialEndDate < now) || 
                       orgData.subscription_status === 'expired';
      
      setIsTrialExpired(isExpired);
      
      if (isExpired) {
        setDaysLeft(0);
        setCountdownString('0 hari 00:00:00');
        
        // Show subscription dialog on non-subscription pages when trial has expired
        if (!isSubscriptionPage) {
          setShowSubscriptionDialog(true);
          
          // Add blur class to body when trial has expired
          document.body.classList.add('trial-expired');
        }
        
        setIsLoading(false);
        return;
      }
      
      if (trialEndDate) {
        const diffTime = trialEndDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays > 0 ? diffDays : 0);
        setIsTrialExpired(diffDays <= 0);
        
        // If we're close to expiration (3 days or less), let's show a toast
        if (diffDays <= 3 && diffDays > 0 && orgData.subscription_status === 'trial') {
          const daysText = diffDays === 1 ? 'day' : 'days';
          toast.warning(
            `Your trial ends in ${diffDays} ${daysText}. Upgrade now to continue using all features.`,
            {
              action: {
                label: "Upgrade",
                onClick: () => navigate("/settings/subscription")
              },
              duration: 10000 // 10 seconds
            }
          );
        }
        
        // Calculate progress percentage
        if (trialStartDate) {
          const totalTrialTime = trialEndDate.getTime() - trialStartDate.getTime();
          const elapsedTime = now.getTime() - trialStartDate.getTime();
          const remainingPercentage = Math.max(0, Math.min(100, 100 - (elapsedTime / totalTrialTime * 100)));
          setProgress(remainingPercentage);
        }
      }
      
      setIsLoading(false);
    };
    
    fetchTrialInfo();
    
    // Cleanup function
    return () => {
      if (isTrialExpired && !isSubscriptionPage) {
        document.body.classList.remove('trial-expired');
      }
    };
  }, [isAuthPage, isDismissed, isOnboardingPage, isSubscriptionPage]);
  
  // Handle subscription navigation
  const handleSubscribe = () => {
    if (daysLeft !== null) {
      subscriptionAnalyticsService.trackTrialBannerClicked(daysLeft, organizationId);
    }
    navigate("/settings/subscription");
    setShowSubscriptionDialog(false);
    // Remove blur when navigating to subscription page
    document.body.classList.remove('trial-expired');
  };

  // Handle sign out
  const handleSignOut = async () => {
    await robustSignOut();
    navigate("/auth/login");
    document.body.classList.remove('trial-expired');
  };
  
  // Don't show anything if not authenticated or on auth pages or if still loading
  if (!isAuthenticated || isAuthPage || isOnboardingPage || isDismissed || isLoading) return null;
  
  // Don't show if subscription is active
  if (subscriptionStatus === 'active') return null;

  const progressColor = daysLeft && daysLeft <= 3 
    ? 'bg-red-500' 
    : daysLeft && daysLeft <= 7 
      ? 'bg-orange-500' 
      : 'bg-blue-500';

  // Handle different states of the trial
  if (isTrialExpired) {
    // Trial is expired, show blocking modal
    return (
      <Sheet open={true} onOpenChange={setShowSubscriptionDialog}>
        <SheetContent side="bottom" className="w-full sm:max-w-md mx-auto h-auto max-h-[90vh] rounded-t-lg bg-white shadow-lg p-0">
          <div className="flex flex-col items-center p-6">
            <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-14 h-14 text-red-600" />
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
    );
  } else if (daysLeft !== null) {
    // Trial is active, show countdown banner
    return (
      <Alert className="sticky top-0 z-50 rounded-none border-b mb-0 py-2 px-4 flex flex-col sm:flex-row items-center justify-between bg-blue-50 border-blue-100">
        <div className="flex items-center w-full">
          <CalendarClock className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
          <div className="w-full">
            <AlertDescription className="text-blue-700 font-medium text-sm">
              Masa trial Anda berakhir dalam <span className="font-semibold">{countdownString}</span>.{' '}
              <Button 
                variant="link" 
                className="h-auto p-0 text-blue-700 underline font-semibold text-sm"
                onClick={() => {
                  subscriptionAnalyticsService.trackTrialBannerClicked(daysLeft, organizationId);
                  navigate("/settings/subscription");
                }}
              >
                Berlangganan sekarang
              </Button>
            </AlertDescription>
            <Progress value={progress} className={`h-1.5 mt-1.5 ${progressColor}`} />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 mt-2 sm:mt-0 flex-shrink-0" onClick={() => setIsDismissed(true)}>
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    );
  }
  
  // Default case - don't show anything
  return null;
};

export default TrialBanner;
