
import { Organization, SubscriptionPlan } from "@/types/organization";

/**
 * Checks if the organization has a paid subscription
 */
export const hasPaidSubscription = (
  organization: Organization | null,
  subscriptionPlan: SubscriptionPlan | null
): boolean => {
  if (!organization || !subscriptionPlan) {
    return false;
  }
  
  // Check if the organization has an active subscription status
  // and a subscription plan that's not the free "Basic" tier
  return (
    organization.subscription_status === 'active' &&
    organization.subscription_plan_id !== null &&
    subscriptionPlan.name !== 'Basic'
  );
};

/**
 * Calculate days remaining in trial
 */
export const calculateTrialDaysRemaining = (
  organization: Organization | null
): number | null => {
  if (!organization || !organization.trial_end_date) {
    return null;
  }
  
  if (organization.subscription_status === 'active') {
    return null; // No trial days if subscription is active
  }
  
  const trialEndDate = new Date(organization.trial_end_date);
  const now = new Date();
  
  if (trialEndDate <= now) {
    return 0; // Trial has ended
  }
  
  // Calculate days difference
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};
