
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrialStatus {
  isTrialActive: boolean;
  daysLeftInTrial: number;
  progress: number;
  isTrialExpired: boolean;
}

export function useTrialStatus(organizationId: string | null): TrialStatus {
  const [status, setStatus] = useState<TrialStatus>({
    isTrialActive: false,
    daysLeftInTrial: 0,
    progress: 0,
    isTrialExpired: false
  });

  useEffect(() => {
    if (!organizationId) return;

    const fetchTrialStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('trial_end_date, trial_expired, subscription_status')
          .eq('id', organizationId)
          .single();

        if (error || !data) {
          console.error("Error fetching trial status:", error);
          return;
        }

        // Check if trial is active
        const trialActive = data.subscription_status === 'trial' && !data.trial_expired;
        
        // Calculate days left in trial
        let daysLeft = 0;
        let progress = 0;
        
        if (data.trial_end_date) {
          const trialEnd = new Date(data.trial_end_date);
          const now = new Date();
          const diffTime = trialEnd.getTime() - now.getTime();
          daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Calculate progress (assuming 14-day trial)
          const totalDays = 14;
          const daysUsed = totalDays - daysLeft;
          progress = Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));
        }

        setStatus({
          isTrialActive: trialActive,
          daysLeftInTrial: Math.max(0, daysLeft),
          progress: 100 - progress, // Invert to show days left
          isTrialExpired: !!data.trial_expired
        });
      } catch (err) {
        console.error("Error in useTrialStatus:", err);
      }
    };

    fetchTrialStatus();
  }, [organizationId]);

  return status;
}
