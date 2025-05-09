
import { supabase } from "@/integrations/supabase/client";
import { Organization } from "@/types/organization";

/**
 * Track a feature access event
 * @param featureName Name of the feature being accessed
 * @param accessGranted Whether access was granted
 * @param reason Reason for access decision
 * @param organizationId The organization ID
 */
export async function trackFeatureAccess(
  featureName: string,
  accessGranted: boolean,
  reason: string,
  organizationId?: string
): Promise<void> {
  try {
    // Track locally first (for immediate analytics)
    const dataLayer = window.dataLayer;
    if (dataLayer) {
      dataLayer.push({
        event: 'feature_access',
        feature_name: featureName,
        access_granted: accessGranted,
        reason: reason,
        timestamp: new Date().toISOString()
      });
    }
    
    // If no organization ID, don't track in database
    if (!organizationId) return;
    
    // Track in database for later analytics
    await supabase.functions.invoke('track-event', {
      body: {
        event_type: 'feature_access',
        organization_id: organizationId,
        additional_data: {
          feature_name: featureName,
          access_granted: accessGranted,
          reason: reason,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error("Failed to track feature access:", error);
    // Non-critical operation, so we just log the error
  }
}

/**
 * Track trial-related events
 * @param eventType The type of event
 * @param organizationId The organization ID
 * @param additionalData Additional data to include
 */
export async function trackTrialEvent(
  eventType: string,
  organizationId: string,
  additionalData?: Record<string, any>
): Promise<void> {
  try {
    // Track locally
    const dataLayer = window.dataLayer;
    if (dataLayer) {
      dataLayer.push({
        event: `trial_${eventType}`,
        organization_id: organizationId,
        ...additionalData,
        timestamp: new Date().toISOString()
      });
    }
    
    // Track in database
    await supabase.functions.invoke('track-event', {
      body: {
        event_type: `trial_${eventType}`,
        organization_id: organizationId,
        additional_data: {
          ...additionalData,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error(`Failed to track trial ${eventType} event:`, error);
  }
}

/**
 * Check if a user has access to a feature based on organization status
 * @param organization The organization object
 * @param isPremiumFeature Whether the feature is premium
 * @returns An object with access decision and reason
 */
export function checkFeatureAccess(
  organization: Organization | null,
  isPremiumFeature: boolean
): { 
  hasAccess: boolean; 
  reason: string;
  daysLeft?: number;
} {
  // If not a premium feature, always grant access
  if (!isPremiumFeature) {
    return { hasAccess: true, reason: 'not_premium_feature' };
  }
  
  // If no organization, deny access
  if (!organization) {
    return { hasAccess: false, reason: 'no_organization' };
  }
  
  // Check if organization has active subscription
  if (organization.subscription_status === 'active' && 
      organization.subscription_plan_id && 
      organization.subscription_plan_id !== 'basic') {
    return { hasAccess: true, reason: 'active_subscription' };
  }
  
  // Check if organization is in active trial
  if (organization.subscription_status === 'trial' && !organization.trial_expired) {
    const now = new Date();
    const trialEndDate = organization.trial_end_date ? new Date(organization.trial_end_date) : null;
    
    if (trialEndDate && trialEndDate > now) {
      const diffTime = trialEndDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return { 
        hasAccess: true, 
        reason: 'active_trial',
        daysLeft: diffDays 
      };
    }
  }
  
  // Check if organization is in grace period
  if (organization.grace_period_end) {
    const now = new Date();
    const gracePeriodEnd = new Date(organization.grace_period_end);
    
    if (gracePeriodEnd > now) {
      return { hasAccess: true, reason: 'grace_period' };
    }
  }
  
  // Default: no access
  return { hasAccess: false, reason: 'no_active_subscription_or_trial' };
}

/**
 * Track user engagement with trial features
 */
export function trackTrialFeatureEngagement(
  featureName: string,
  engagementType: 'view' | 'interact' | 'convert',
  organizationId?: string
): void {
  try {
    // Only track if we have an organization ID
    if (!organizationId) return;
    
    // Track client-side first for immediate analytics
    const dataLayer = window.dataLayer;
    if (dataLayer) {
      dataLayer.push({
        event: 'trial_feature_engagement',
        feature_name: featureName,
        engagement_type: engagementType,
        timestamp: new Date().toISOString()
      });
    }
    
    // Also track server-side for more reliable analytics
    supabase.functions.invoke('track-event', {
      body: {
        event_type: 'trial_feature_engagement',
        organization_id: organizationId,
        additional_data: {
          feature_name: featureName,
          engagement_type: engagementType,
          timestamp: new Date().toISOString()
        }
      }
    }).catch(error => {
      console.error("Failed to track trial feature engagement:", error);
    });
  } catch (error) {
    console.error("Error in trackTrialFeatureEngagement:", error);
  }
}
