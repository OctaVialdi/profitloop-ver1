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

/**
 * Check if user has access to premium features
 * @param organization The organization object
 * @returns boolean True if user has access to premium features
 */
export function hasPremiumAccess(organization: Organization | null): boolean {
  if (!organization) return false;
  
  // If they have a paid subscription
  if (organization.subscription_status === 'active' && 
      organization.subscription_plan_id && 
      organization.subscription_plan_id !== 'basic') {
    return true;
  }
  
  // If they are in an active trial period
  if (organization.subscription_status === 'trial' && !organization.trial_expired) {
    const now = new Date();
    const trialEndDate = organization.trial_end_date ? new Date(organization.trial_end_date) : null;
    if (trialEndDate && trialEndDate > now) {
      return true;
    }
  }
  
  // If they are in grace period after trial expiration
  if (organization.subscription_status === 'expired' && organization.grace_period_end) {
    const now = new Date();
    const gracePeriodEnd = new Date(organization.grace_period_end);
    if (gracePeriodEnd > now) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if the trial expiration should be reminded
 * @returns Object with reminder info
 */
export function shouldRemindTrialExpiration(organization: Organization | null): 
  { shouldRemind: boolean; severity: 'low' | 'medium' | 'high'; daysLeft: number } {
  
  if (!organization || !organization.trial_end_date) {
    return { shouldRemind: false, severity: 'low', daysLeft: 0 };
  }
  
  // If subscription is active, no need for reminders
  if (organization.subscription_status === 'active') {
    return { shouldRemind: false, severity: 'low', daysLeft: 0 };
  }
  
  const now = new Date();
  const trialEndDate = new Date(organization.trial_end_date);
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Already expired
  if (diffDays <= 0) {
    return { shouldRemind: true, severity: 'high', daysLeft: 0 };
  }
  
  // Less than a day left (show in hours)
  if (diffDays === 1) {
    return { shouldRemind: true, severity: 'high', daysLeft: 1 };
  }
  
  // Less than 3 days left
  if (diffDays <= 3) {
    return { shouldRemind: true, severity: 'medium', daysLeft: diffDays };
  }
  
  // Less than 7 days left
  if (diffDays <= 7) {
    return { shouldRemind: true, severity: 'low', daysLeft: diffDays };
  }
  
  return { shouldRemind: false, severity: 'low', daysLeft: diffDays };
}

/**
 * Force updates the trial status for the current organization
 * This is useful when we know the trial has expired but the flag hasn't been updated
 */
export async function checkAndUpdateTrialStatus(organizationId: string): Promise<boolean> {
  try {
    // Get organization details
    const { data: orgData } = await supabase
      .from('organizations')
      .select('trial_end_date, trial_expired')
      .eq('id', organizationId)
      .single();
      
    if (!orgData) return false;
    
    // Check if trial has expired based on date
    const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
    const now = new Date();
    const isTrialExpiredByDate = trialEndDate && trialEndDate < now;
    
    // If trial is expired by date but not flagged, update it
    if (isTrialExpiredByDate && !orgData.trial_expired) {
      console.log("Trial has expired by date but not flagged. Updating flag.");
      const { error } = await supabase
        .from('organizations')
        .update({ 
          trial_expired: true,
          subscription_status: 'expired'
        })
        .eq('id', organizationId);
        
      if (error) {
        console.error("Error updating trial_expired flag:", error);
        return false;
      }
      
      // Also invoke edge function to perform any additional processing
      try {
        await supabase.functions.invoke('check-trial-expiration');
      } catch (err) {
        console.error("Failed to invoke check-trial-expiration:", err);
        // Continue even if the edge function fails
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error in checkAndUpdateTrialStatus:", error);
    return false;
  }
}

/**
 * Manually trigger the edge function to check trial expirations
 */
export async function triggerTrialExpirationCheck(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('check-trial-expiration');
    
    if (error) {
      console.error("Error triggering trial expiration check:", error);
      return false;
    }
    
    console.log("Trial expiration check triggered:", data);
    return true;
  } catch (error) {
    console.error("Error in triggerTrialExpirationCheck:", error);
    return false;
  }
}
