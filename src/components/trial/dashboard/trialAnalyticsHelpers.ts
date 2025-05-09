
import { Organization } from "@/types/organization";
import { trackTrialEvent } from "@/services/analyticsService";

export function getTrialMilestone(organization: Organization | null): string | null {
  if (!organization?.trial_start_date || !organization?.trial_end_date) return null;
  
  const start = new Date(organization.trial_start_date).getTime();
  const end = new Date(organization.trial_end_date).getTime();
  const now = new Date().getTime();
  const totalDuration = end - start;
  const elapsed = now - start;
  
  // Calculate progress percentage
  const progress = Math.max(0, Math.min(100, (elapsed / totalDuration * 100)));
  
  if (progress < 10) return 'beginning';
  if (progress >= 90) return 'ending';
  if (progress >= 75) return '75-percent';
  if (progress >= 50) return 'halfway';
  if (progress >= 25) return '25-percent';
  return null;
}

export function trackTrialUpgradeClick(organizationId: string | undefined, daysLeftInTrial: number, milestone: string | null) {
  if (organizationId) {
    trackTrialEvent('dashboard_upgrade_click', organizationId, { 
      days_left: daysLeftInTrial,
      milestone
    });
  }
}

export function trackTrialExtensionClick(organizationId: string | undefined) {
  if (organizationId) {
    trackTrialEvent('extension_request_click', organizationId);
  }
}

export function trackTrialExtensionSuccess(organizationId: string | undefined) {
  if (organizationId) {
    trackTrialEvent('extension_request_success', organizationId);
  }
}
