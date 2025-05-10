
import { Organization, SubscriptionPlan } from "@/types/organization";

/**
 * Calculate if a trial is active and how many days are left
 */
export const calculateTrialStatus = (organization: Organization) => {
  if (!organization.trial_end_date) {
    return { isTrialActive: false, daysLeftInTrial: 0, isTrialExpired: true };
  }
  
  const now = new Date();
  const trialEndDate = new Date(organization.trial_end_date);
  
  // Check if trial has expired
  if (organization.trial_expired || now > trialEndDate) {
    return { isTrialActive: false, daysLeftInTrial: 0, isTrialExpired: true };
  }
  
  // Calculate days left
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return { 
    isTrialActive: true, 
    daysLeftInTrial: diffDays,
    isTrialExpired: false
  };
};

/**
 * Calculate if the organization has a paid subscription
 */
export const calculateSubscriptionStatus = (organization: Organization, subscriptionPlan: SubscriptionPlan | null) => {
  // Check if the organization has a paid subscription
  return organization.subscription_status === 'active' || organization.subscription_status === 'paid';
};

/**
 * Calculate percentage progress between two dates
 */
export const calculateProgressPercentage = (startDateStr: string, endDateStr: string) => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const today = new Date();
  
  // Get total duration in milliseconds
  const totalDuration = endDate.getTime() - startDate.getTime();
  
  // Get elapsed duration in milliseconds
  const elapsedDuration = today.getTime() - startDate.getTime();
  
  // Calculate percentage (ensure between 0 and 100)
  const percentage = Math.min(100, Math.max(0, Math.floor((elapsedDuration / totalDuration) * 100)));
  
  return percentage;
};
