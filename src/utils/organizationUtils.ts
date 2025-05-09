
import { Organization, SubscriptionPlan, UserProfile } from "@/types/organization";

export function calculateTrialStatus(organization: Organization | null): {
  isTrialActive: boolean;
  daysLeftInTrial: number;
} {
  // If no organization or no trial_end_date, return inactive
  if (!organization || !organization.trial_end_date) {
    return {
      isTrialActive: false,
      daysLeftInTrial: 0
    };
  }
  
  const now = new Date();
  const trialEnd = new Date(organization.trial_end_date);
  const isTrialActive = now < trialEnd;
  
  // Calculate days left in trial
  let daysLeftInTrial = 0;
  if (isTrialActive) {
    const diffTime = Math.abs(trialEnd.getTime() - now.getTime());
    daysLeftInTrial = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  return {
    isTrialActive,
    daysLeftInTrial
  };
}

export function calculateSubscriptionStatus(
  organization: Organization | null,
  subscriptionPlan: SubscriptionPlan | null
): boolean {
  return !!subscriptionPlan && 
         subscriptionPlan.price > 0 && 
         !organization?.trial_expired;
}

export function calculateUserRoles(userProfile: UserProfile | null): {
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
} {
  const isSuperAdmin = userProfile?.role === 'super_admin';
  const isAdmin = userProfile?.role === 'admin' || isSuperAdmin;
  const isEmployee = userProfile?.role === 'employee' || isAdmin;

  return { isSuperAdmin, isAdmin, isEmployee };
}
