
import { Organization, SubscriptionPlan, UserProfile } from "@/types/organization";

export function calculateTrialStatus(organization: Organization | null): {
  isTrialActive: boolean;
  daysLeftInTrial: number;
} {
  // Always return inactive trial since we're removing trial functionality
  return {
    isTrialActive: false,
    daysLeftInTrial: 0
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
