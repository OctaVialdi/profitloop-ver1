
import { Organization, SubscriptionPlan, UserProfile } from "@/types/organization";

export function calculateTrialStatus(organization: Organization | null): {
  isTrialActive: boolean;
  daysLeftInTrial: number;
  isExpired: boolean;
  inGracePeriod: boolean;
} {
  if (!organization || !organization.trial_end_date) {
    return {
      isTrialActive: false,
      daysLeftInTrial: 0,
      isExpired: false,
      inGracePeriod: false
    };
  }

  const now = new Date();
  const trialEndDate = new Date(organization.trial_end_date);
  const gracePeriodEnd = organization.grace_period_end ? new Date(organization.grace_period_end) : null;
  
  // Check if subscription is active (not in trial)
  if (organization.subscription_status === 'active') {
    return {
      isTrialActive: false,
      daysLeftInTrial: 0,
      isExpired: false,
      inGracePeriod: false
    };
  }
  
  // Check if trial has expired
  const isExpired = trialEndDate < now;
  
  // Check if in grace period
  const inGracePeriod = isExpired && gracePeriodEnd && gracePeriodEnd > now;
  
  // Calculate days left in trial
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const daysLeft = diffDays > 0 ? diffDays : 0;
  
  return {
    isTrialActive: !isExpired && organization.subscription_status === 'trial',
    daysLeftInTrial: daysLeft,
    isExpired: isExpired && organization.subscription_status === 'expired',
    inGracePeriod
  };
}

export function calculateSubscriptionStatus(
  organization: Organization | null,
  subscriptionPlan: SubscriptionPlan | null
): boolean {
  return !!subscriptionPlan && 
         subscriptionPlan.name !== 'Basic' && 
         !!organization?.subscription_plan_id && 
         organization?.subscription_status === 'active';
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
