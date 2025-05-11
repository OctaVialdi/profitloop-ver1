
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type TrialStatusLevel = 'critical' | 'warning' | 'normal';

export function useTrialStatus(organizationId: string | null) {
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  const [isTrialExpired, setIsTrialExpired] = useState<boolean>(false);
  const [daysLeftInTrial, setDaysLeftInTrial] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [statusLevel, setStatusLevel] = useState<TrialStatusLevel>('normal');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTrialStatus = async () => {
      if (!organizationId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch organization details
        const { data: organization, error } = await supabase
          .from('organizations')
          .select('trial_start_date, trial_end_date, trial_expired, subscription_status')
          .eq('id', organizationId)
          .single();
          
        if (error || !organization) {
          console.error('Error fetching trial status:', error);
          setIsLoading(false);
          return;
        }
        
        // Calculate days left in trial
        const now = new Date();
        const trialEnd = organization.trial_end_date ? new Date(organization.trial_end_date) : null;
        const trialStart = organization.trial_start_date ? new Date(organization.trial_start_date) : null;
        
        if (trialEnd && trialStart) {
          // Check if trial is active
          const isActive = !organization.trial_expired && trialEnd > now;
          setIsTrialActive(isActive);
          setIsTrialExpired(organization.trial_expired || false);
          
          // Calculate days left and progress
          if (isActive) {
            const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 3600 * 24));
            setDaysLeftInTrial(daysLeft);
            
            const totalDays = Math.ceil((trialEnd.getTime() - trialStart.getTime()) / (1000 * 3600 * 24));
            const daysUsed = totalDays - daysLeft;
            const progressPercentage = (daysUsed / totalDays) * 100;
            
            setProgress(progressPercentage);
            
            // Set status level based on days left
            if (daysLeft <= 1) {
              setStatusLevel('critical');
            } else if (daysLeft <= 3) {
              setStatusLevel('warning');
            } else {
              setStatusLevel('normal');
            }
          } else {
            setDaysLeftInTrial(0);
            setProgress(100);
            setStatusLevel('critical');
          }
        }
      } catch (err) {
        console.error('Error in useTrialStatus:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    getTrialStatus();
  }, [organizationId]);
  
  return {
    isTrialActive,
    isTrialExpired,
    daysLeftInTrial,
    progress,
    statusLevel,
    isLoading
  };
}
