
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkAndUpdateTrialStatus, fixOrganizationTrialPeriod } from '@/services/subscriptionService';

interface TrialStatus {
  isTrialActive: boolean;
  isTrialExpired: boolean;
  daysLeftInTrial: number;
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
  trialEndDate: Date | null;
  trialStartDate: Date | null;
  trialDuration: number;
  subscriptionStatus: string | null;
}

export function useTrialStatus(organizationId: string | null, skipCheck: boolean = false) {
  const [status, setStatus] = useState<TrialStatus>({
    isTrialActive: false,
    isTrialExpired: false,
    daysLeftInTrial: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    progress: 0,
    trialEndDate: null,
    trialStartDate: null,
    trialDuration: 14, // Default to 14 days
    subscriptionStatus: null
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (skipCheck || !organizationId) {
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        setLoading(true);
        
        // First fix any inconsistent trial periods
        await fixOrganizationTrialPeriod(organizationId);
        
        // Force check and update trial status
        await checkAndUpdateTrialStatus(organizationId);
        
        // Fetch current trial data
        const { data: orgData, error } = await supabase
          .from('organizations')
          .select('trial_end_date, trial_expired, trial_start_date, subscription_status')
          .eq('id', organizationId)
          .single();
          
        if (error) throw error;
        if (!orgData) throw new Error("Organization not found");

        // Process trial data
        const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
        const trialStartDate = orgData.trial_start_date ? new Date(orgData.trial_start_date) : null;
        const now = new Date();
        
        // Calculate trial duration
        let trialDuration = 14; // Default to 14 days
        if (trialStartDate && trialEndDate) {
          const diffTime = trialEndDate.getTime() - trialStartDate.getTime();
          trialDuration = Math.round(diffTime / (1000 * 60 * 60 * 24));
        }
        
        // Calculate time left
        const isExpired = orgData.trial_expired || 
                         (trialEndDate && trialEndDate < now) || 
                         orgData.subscription_status === 'expired';
                         
        let daysLeft = 0;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let progress = 0;
        
        if (trialEndDate && !isExpired) {
          const diffTime = trialEndDate.getTime() - now.getTime();
          daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
          seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
          
          // Calculate progress percentage if trial start date is available
          if (trialStartDate) {
            const totalTrialTime = trialEndDate.getTime() - trialStartDate.getTime();
            const elapsedTime = now.getTime() - trialStartDate.getTime();
            progress = Math.max(0, Math.min(100, 100 - (elapsedTime / totalTrialTime * 100)));
          }
        }
        
        setStatus({
          isTrialActive: !isExpired && orgData.subscription_status === 'trial',
          isTrialExpired: isExpired,
          daysLeftInTrial: daysLeft,
          hours,
          minutes,
          seconds,
          progress,
          trialEndDate,
          trialStartDate,
          trialDuration,
          subscriptionStatus: orgData.subscription_status
        });
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error fetching trial status:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchStatus();
    
    // Set up interval to update every second
    const intervalId = setInterval(fetchStatus, 1000);
    
    // Clean up
    return () => clearInterval(intervalId);
  }, [organizationId, skipCheck]);

  return { ...status, loading, error };
}
