
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useTrialStatus = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // Skip on auth pages
  const isAuthPage = location.pathname.startsWith('/auth/');
  const isOnboardingPage = location.pathname === '/onboarding';
  const isSubscriptionPage = location.pathname === '/subscription';

  useEffect(() => {
    if (isAuthPage || isOnboardingPage || isSubscriptionPage) {
      setIsLoading(false);
      return;
    }
    
    const checkTrialExpiration = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Get user's organization
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
        
        // Get organization details
        const { data: orgData } = await supabase
          .from('organizations')
          .select('trial_end_date, trial_expired')
          .eq('id', profileData.organization_id)
          .maybeSingle();
          
        if (!orgData) {
          setIsLoading(false);
          return;
        }
        
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
          
          if (!isSubscriptionPage) {
            document.body.classList.add('trial-expired');
          }
        } else if (endDate) {
          // Trial not expired, calculate days left
          const diffTime = endDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysLeft(diffDays > 0 ? diffDays : 0);
          setIsTrialExpired(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking trial expiration:", error);
        setIsLoading(false);
      }
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
  }, [isAuthPage, isOnboardingPage, isSubscriptionPage, isTrialExpired]);
  
  // Handle subscription navigation
  const handleSubscribe = () => {
    window.location.href = "/subscription";
    // Remove blur when navigating to subscription page
    document.body.classList.remove('trial-expired');
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
    document.body.classList.remove('trial-expired');
  };
  
  return {
    isAuthenticated,
    isLoading,
    daysLeft,
    trialEndDate,
    isTrialExpired,
    handleSubscribe,
    handleSignOut,
    isAuthPage,
    isOnboardingPage,
    isSubscriptionPage
  };
};

export default useTrialStatus;
