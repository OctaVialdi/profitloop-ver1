
import { useState, useEffect } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { trackTrialEvent } from "@/services/analyticsService";

export interface TrialTooltipState {
  isHovering: boolean;
  isMobile: boolean;
  showTooltip: boolean;
  isTrialExpired: boolean;
  trialEndDate?: string;
  daysLeftInTrial: number;
  calculateTrialProgress: () => number;
  getProgressColorClass: () => string;
}

export function useTrialTooltip(featureName: string, isPremiumOnly: boolean = false) {
  const { isTrialActive, organization, hasPaidSubscription, daysLeftInTrial } = useOrganization();
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  const showTooltip = isPremiumOnly && !hasPaidSubscription;
  const isTrialExpired = !isTrialActive && !hasPaidSubscription;
  const trialEndDate = organization?.trial_end_date;

  // Calculate trial progress percentage
  const calculateTrialProgress = () => {
    if (!organization?.trial_start_date || !organization?.trial_end_date) return 100;
    
    const start = new Date(organization.trial_start_date).getTime();
    const end = new Date(organization.trial_end_date).getTime();
    const now = new Date().getTime();
    const totalDuration = end - start;
    const elapsed = now - start;
    
    // Return remaining percentage (100 to 0)
    return Math.max(0, Math.min(100, 100 - (elapsed / totalDuration * 100)));
  };

  // Progress color based on remaining time
  const getProgressColorClass = () => {
    if (daysLeftInTrial <= 1) return 'trial-progress-low';
    if (daysLeftInTrial <= 3) return 'trial-progress-medium';
    return 'trial-progress-high';
  };

  // Track tooltip interactions
  const handleTooltipOpen = () => {
    if (organization?.id && isPremiumOnly) {
      trackTrialEvent('tooltip_viewed', organization.id, {
        feature_name: featureName,
        days_left: daysLeftInTrial,
        is_expired: isTrialExpired
      });
    }
  };

  // Track upgrade button click
  const handleUpgradeClick = () => {
    if (organization?.id) {
      trackTrialEvent('tooltip_upgrade_click', organization.id, {
        feature_name: featureName,
        days_left: daysLeftInTrial,
        is_expired: isTrialExpired
      });
    }
  };

  return {
    isHovering,
    setIsHovering,
    isMobile,
    showTooltip,
    isTrialExpired,
    trialEndDate,
    daysLeftInTrial,
    calculateTrialProgress,
    getProgressColorClass,
    handleTooltipOpen,
    handleUpgradeClick,
  };
}
