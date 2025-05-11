
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CalendarClock, X, AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { checkAndUpdateTrialStatus, fixOrganizationTrialPeriod } from '@/services/subscriptionService';
import { subscriptionAnalyticsService } from '@/services/subscriptionAnalyticsService';
import { subscriptionNotificationService } from '@/services/subscriptionNotificationService';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TrialExpiredModal } from '@/components/subscription/TrialExpiredModal';
import { TrialProgressIndicator } from '@/components/subscription/TrialProgressIndicator';

const TrialBanner = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [countdownString, setCountdownString] = useState<string>('');
  const [isDismissed, setIsDismissed] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState<string>('');
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(100);
  const [trialDuration, setTrialDuration] = useState(14); // Default to 14 days
  const location = useLocation();
  const navigate = useNavigate();
  
  // Skip on auth pages
  const isAuthPage = location.pathname.startsWith('/auth/');
  const isOnboardingPage = location.pathname === '/onboarding' || location.pathname === '/organizations';
  const isSubscriptionPage = location.pathname.includes('/settings/subscription') || location.pathname.includes('/subscription');
  
  // Update countdown every second when we have a trial end date
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
    
    // Set up interval for updating the countdown
    const interval = setInterval(updateCountdown, 1000);
    
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
        
        // Fix any inconsistent trial periods
        await fixOrganizationTrialPeriod(orgId);
        
        // Now fetch the updated organization data
        const { data: orgData } = await supabase
          .from('organizations')
          .select('trial_end_date, trial_expired, trial_start_date, subscription_status, name')
          .eq('id', orgId)
          .maybeSingle();
            
        if (!orgData) {
          setIsLoading(false);
          return;
        }
        
        setOrganizationName(orgData.name || 'your organization');
        await handleTrialData(orgData);
      } catch (error) {
        console.error("Error fetching organization data:", error);
        setIsLoading(false);
      }
    };
    
    // Function to handle trial data processing
    const handleTrialData = async (orgData: any) => {
      // Process trial start and end dates
      const trialStartDate = orgData.trial_start_date ? new Date(orgData.trial_start_date) : null;
      const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
      const now = new Date();
      
      setTrialStartDate(trialStartDate);
      setTrialEndDate(trialEndDate);
      setSubscriptionStatus(orgData.subscription_status);
      
      if (trialStartDate && trialEndDate) {
        // Calculate actual trial duration in days
        const diffTime = trialEndDate.getTime() - trialStartDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTrialDuration(diffDays);
      }
      
      const isExpired = orgData.trial_expired || 
                       (trialEndDate && trialEndDate < now) || 
                       orgData.subscription_status === 'expired';
      
      setIsTrialExpired(isExpired);
      
      if (isExpired) {
        setDaysLeft(0);
        setCountdownString('0 hari 00:00:00');
        
        // Show subscription dialog on non-subscription pages when trial has expired
        if (!isSubscriptionPage) {
          setShowExpiredModal(true);
          
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
        
        // If we're close to expiration, send trial reminder email and notification
        if (diffDays <= 7 && diffDays > 0 && orgData.subscription_status === 'trial' && organizationId) {
          // Check if we should send a reminder (we'll use localStorage to avoid sending too many)
          const lastReminderKey = `trial_reminder_${organizationId}_${diffDays}`;
          const lastReminder = localStorage.getItem(lastReminderKey);
          const today = new Date().toDateString();
          
          // Only send reminders on 7, 3, and 1 days before expiration
          if ((diffDays === 7 || diffDays === 3 || diffDays === 1) && 
              (!lastReminder || lastReminder !== today)) {
            
            try {
              // Get user email - FIXED: Using an async context
              const userResponse = await supabase.auth.getUser();
              const user = userResponse.data?.user;
              
              if (user?.email) {
                // Send email reminder
                subscriptionNotificationService.sendTrialExpirationReminder(
                  organizationId,
                  diffDays,
                  user.email
                ).then(success => {
                  if (success) {
                    // Store the date of this reminder to avoid sending duplicates
                    localStorage.setItem(lastReminderKey, today);
                    console.log(`Trial reminder email sent for ${diffDays} days left`);
                  }
                });
              }
            } catch (error) {
              console.error("Error getting user:", error);
            }
            
            // Create in-app notification
            subscriptionNotificationService.createTrialExpirationNotification(
              organizationId,
              diffDays
            );
          }
          
          // Show toast notification 
          subscriptionNotificationService.showTrialExpirationToast(diffDays, navigate);
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
  }, [isAuthPage, isDismissed, isOnboardingPage, isSubscriptionPage, navigate]);
  
  // Handle subscription navigation
  const handleSubscribe = () => {
    if (organizationId) {
      subscriptionAnalyticsService.trackEvent({
        eventType: 'trial_banner_clicked',
        organizationId: organizationId,
        additionalData: { 
          daysLeft: daysLeft,
          source: 'banner' 
        }
      });
    }
    navigate('/settings/subscription');
  };
  
  // Handle dismiss click
  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('trial_banner_dismissed', 'true');
    
    if (organizationId) {
      subscriptionAnalyticsService.trackEvent({
        eventType: 'banner_dismissed',
        organizationId: organizationId,
        additionalData: { daysLeft: daysLeft }
      });
    }
  };
  
  // Don't show the banner on auth pages, if not authenticated, if dismissed, or if loading
  if (isAuthPage || !isAuthenticated || isDismissed || isLoading || !daysLeft || isSubscriptionPage) {
    return null;
  }
  
  // Don't show the banner if the user has a subscription
  if (subscriptionStatus === 'active') {
    return null;
  }
  
  // Determine alert variant based on days left
  const getVariant = () => {
    if (isTrialExpired) return "destructive";
    if (daysLeft <= 3) return "default";
    return "default";
  };
  
  // Get appropriate message based on days left
  const getMessage = () => {
    if (isTrialExpired) {
      return "Masa trial Anda telah berakhir. Silakan berlangganan untuk melanjutkan akses penuh.";
    }
    if (daysLeft === 1) {
      return "Masa trial Anda akan berakhir besok! Upgrade sekarang untuk menghindari gangguan layanan.";
    }
    if (daysLeft <= 3) {
      return `Masa trial Anda akan berakhir dalam ${daysLeft} hari. Upgrade sekarang untuk menghindari kehilangan akses.`;
    }
    return `Masa trial Anda akan berakhir dalam ${countdownString}`;
  };
  
  return (
    <>
      <Alert variant={getVariant()} className="mb-4 pr-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {isTrialExpired ? (
              <AlertTriangle className="h-5 w-5 mr-2" />
            ) : (
              <CalendarClock className="h-5 w-5 mr-2" />
            )}
            <AlertDescription>{getMessage()}</AlertDescription>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <TrialProgressIndicator 
              daysLeft={daysLeft}
              progress={progress}
              compact
              showButton={false}
            />
            <Button
              variant={isTrialExpired ? "destructive" : "secondary"}
              size="sm"
              onClick={handleSubscribe}
            >
              Upgrade
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Alert>
      
      {/* Modal for expired trial */}
      <TrialExpiredModal
        isOpen={showExpiredModal && isTrialExpired}
        organizationName={organizationName}
        onUpgrade={() => {
          if (organizationId) {
            subscriptionAnalyticsService.trackEvent({
              eventType: 'trial_expired_action',
              organizationId: organizationId
            });
          }
          setShowExpiredModal(false);
          navigate('/settings/subscription');
        }}
        onRequest={() => {
          if (organizationId) {
            subscriptionAnalyticsService.trackEvent({
              eventType: 'extension_requested',
              organizationId: organizationId
            });
          }
          setShowExpiredModal(false);
          navigate('/settings/subscription/request-extension');
        }}
        allowClose={false}
      />
    </>
  );
};

export default TrialBanner;
