
import { Organization, SubscriptionPlan, UserProfile } from "@/types/organization";

export function calculateTrialStatus(organization: Organization | null): {
  isTrialActive: boolean;
  daysLeftInTrial: number;
} {
  if (!organization || !organization.trial_end_date) {
    return {
      isTrialActive: false,
      daysLeftInTrial: 0
    };
  }

  const now = new Date();
  const trialEndDate = new Date(organization.trial_end_date);
  
  // Check if trial is active based on trial_expired flag and date comparison
  const isActive = 
    organization.subscription_status === 'trial' && 
    !organization.trial_expired && 
    trialEndDate > now;
  
  // Calculate days left
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    isTrialActive: isActive,
    daysLeftInTrial: diffDays > 0 ? diffDays : 0
  };
}

export function calculateSubscriptionStatus(
  organization: Organization | null,
  subscriptionPlan: SubscriptionPlan | null
): boolean {
  return !!organization?.subscription_plan_id && 
         !!subscriptionPlan && 
         subscriptionPlan.name !== 'Basic' && 
         organization.subscription_status === 'active';
}

export function calculateUserRoles(userProfile: UserProfile | null): {
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
} {
  const isSuperAdmin = userProfile?.role === 'super_admin';
  const isAdmin = userProfile?.role === 'admin' || isSuperAdmin;
  const isEmployee = !!userProfile?.role;

  return { isSuperAdmin, isAdmin, isEmployee };
}

/**
 * Determines if the grace period is active for an expired trial
 */
export function isInGracePeriod(organization: Organization | null): boolean {
  if (!organization || !organization.grace_period_end || !organization.trial_expired) {
    return false;
  }
  
  const now = new Date();
  const gracePeriodEnd = new Date(organization.grace_period_end);
  
  return gracePeriodEnd > now;
}

/**
 * Formats a trial end date into a human-readable countdown
 */
export function formatTrialCountdown(trialEndDate: string | null): string {
  if (!trialEndDate) return '';
  
  const now = new Date();
  const endDate = new Date(trialEndDate);
  const diffTime = endDate.getTime() - now.getTime();
  
  if (diffTime <= 0) return 'Trial berakhir';
  
  // Calculate days, hours, minutes
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} hari ${hours} jam lagi`;
  }
  
  if (hours > 0) {
    return `${hours} jam ${minutes} menit lagi`;
  }
  
  return `${minutes} menit lagi`;
}
