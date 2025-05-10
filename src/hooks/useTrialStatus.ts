
import { useEffect, useState } from "react";
import { Organization } from "@/types/organization";

export const useTrialStatus = (organization: Organization | null) => {
  const [daysLeftInTrial, setDaysLeftInTrial] = useState<number | null>(null);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [hasPaidSubscription, setHasPaidSubscription] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!organization) return;

    // Check if the organization has a paid subscription
    const hasSubscription = organization.subscription_status === 'active' && 
                           organization.subscription_plan_id !== null;
    setHasPaidSubscription(hasSubscription);

    // Calculate trial days left if trial_end_date is available
    if (organization.trial_end_date) {
      const now = new Date();
      const trialEnd = new Date(organization.trial_end_date);
      
      if (trialEnd > now && !organization.trial_expired) {
        const diffTime = trialEnd.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        setDaysLeftInTrial(diffDays);
        setIsTrialActive(true);
        setIsTrialExpired(false);
        
        // Calculate trial progress
        const trialStart = new Date(organization.trial_start_date || now);
        const totalTrialDays = Math.ceil((trialEnd.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
        const daysUsed = totalTrialDays - diffDays;
        const progressPercent = (daysUsed / totalTrialDays) * 100;
        setProgress(Math.min(progressPercent, 100));
      } else {
        setDaysLeftInTrial(0);
        setIsTrialActive(false);
        setIsTrialExpired(true);
        setProgress(100);
      }
    } else {
      setIsTrialActive(false);
      setDaysLeftInTrial(null);
      setProgress(0);
    }
  }, [organization]);

  return {
    daysLeftInTrial,
    isTrialActive,
    isTrialExpired,
    hasPaidSubscription,
    progress
  };
};
