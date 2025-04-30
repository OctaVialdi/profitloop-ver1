
import { Organization, SubscriptionPlan, UserProfile } from "@/types/organization";

export function calculateTrialStatus(organization: Organization | null): {
  isTrialActive: boolean;
  daysLeftInTrial: number;
} {
  if (!organization?.trial_end_date) {
    return {
      isTrialActive: false,
      daysLeftInTrial: 0
    };
  }
  
  const isTrialActive = 
    new Date(organization.trial_end_date) > new Date() && 
    !organization.trial_expired;
                      
  const daysLeftInTrial = isTrialActive
    ? Math.max(0, Math.ceil((new Date(organization.trial_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return { isTrialActive, daysLeftInTrial };
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
