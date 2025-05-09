
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
  return !!subscriptionPlan && 
         subscriptionPlan.name !== 'Basic' && 
         !!organization?.subscription_plan_id;
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
