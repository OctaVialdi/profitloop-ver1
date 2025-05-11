
import { Organization, SubscriptionPlan, UserProfile, ThemeSettings } from "@/types/organization";

export function calculateTrialStatus(organization: Organization | null): {
  isTrialActive: boolean;
  daysLeftInTrial: number;
} {
  if (!organization || !organization.trial_end_date || organization.trial_expired) {
    return {
      isTrialActive: false,
      daysLeftInTrial: 0
    };
  }

  // Check if subscription is active
  if (organization.subscription_status === 'active') {
    return {
      isTrialActive: false,
      daysLeftInTrial: 0
    };
  }

  // Calculate days left in trial
  const trialEnd = new Date(organization.trial_end_date);
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isTrialActive: diffDays > 0 && organization.subscription_status === 'trial',
    daysLeftInTrial: diffDays > 0 ? diffDays : 0
  };
}

export function calculateSubscriptionStatus(
  organization: Organization | null,
  subscriptionPlan: SubscriptionPlan | null
): boolean {
  return !!subscriptionPlan && 
         subscriptionPlan.name !== 'Basic' && 
         !!organization?.subscription_plan_id &&
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
