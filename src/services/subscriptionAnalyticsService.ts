
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export type SubscriptionEventType = 
  | 'subscription_page_view'
  | 'plan_selected'
  | 'checkout_initiated'
  | 'subscription_activated'
  | 'trial_started'
  | 'trial_banner_clicked'
  | 'trial_extension_requested'
  | 'premium_feature_clicked'
  | 'subscription_cancelled'
  | 'subscription_upgraded'
  | 'payment_status'       // Add this
  | 'customer_portal_access'; // Add this

interface AnalyticsEventPayload {
  eventType: SubscriptionEventType;
  organizationId?: string;
  planId?: string;
  previousPlanId?: string;
  additionalData?: Record<string, any>;
}

/**
 * Service to track subscription-related analytics events
 */
export const subscriptionAnalyticsService = {
  /**
   * Track a subscription-related analytics event
   */
  async trackEvent({
    eventType,
    organizationId,
    planId,
    previousPlanId,
    additionalData
  }: AnalyticsEventPayload): Promise<boolean> {
    try {
      // Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Cannot track event: No authenticated user");
        return false;
      }
      
      // If organization ID is not provided, try to get from user metadata
      const finalOrgId = organizationId || user.user_metadata?.organization_id;
      
      if (!finalOrgId) {
        console.error("Cannot track event: No organization ID available");
        return false;
      }

      // Insert analytics event into Supabase table
      const { error } = await supabase.from('subscription_analytics').insert({
        event_type: eventType,
        organization_id: finalOrgId,
        user_id: user.id,
        plan_id: planId,
        previous_plan_id: previousPlanId,
        additional_data: additionalData
      });

      if (error) {
        console.error("Error tracking subscription analytics event:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to track subscription analytics event:", error);
      return false;
    }
  },

  /**
   * Track when the subscription page is viewed
   */
  trackSubscriptionPageView(orgId?: string, additionalData?: Record<string, any>): void {
    this.trackEvent({
      eventType: 'subscription_page_view',
      organizationId: orgId,
      additionalData
    }).catch(err => console.error("Failed to track subscription page view:", err));
  },

  /**
   * Track when a plan is selected
   */
  trackPlanSelected(planId: string, orgId?: string, additionalData?: Record<string, any>): void {
    this.trackEvent({
      eventType: 'plan_selected',
      organizationId: orgId,
      planId,
      additionalData
    }).catch(err => console.error("Failed to track plan selection:", err));
  },

  /**
   * Track when a trial is started
   */
  trackTrialStarted(orgId?: string, additionalData?: Record<string, any>): void {
    this.trackEvent({
      eventType: 'trial_started',
      organizationId: orgId,
      additionalData
    }).catch(err => console.error("Failed to track trial start:", err));
  },

  /**
   * Track when a premium feature is clicked
   */
  trackPremiumFeatureClicked(featureName: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'premium_feature_clicked',
      organizationId: orgId,
      additionalData: { featureName }
    }).catch(err => console.error("Failed to track premium feature click:", err));
  },

  /**
   * Track when checkout process is initiated
   */
  trackCheckoutInitiated(planId: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'checkout_initiated',
      organizationId: orgId,
      planId,
    }).catch(err => console.error("Failed to track checkout initiation:", err));
  },

  /**
   * Track when trial extension is requested
   */
  trackTrialExtensionRequested(reason: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'trial_extension_requested',
      organizationId: orgId,
      additionalData: { reason }
    }).catch(err => console.error("Failed to track trial extension request:", err));
  },

  /**
   * Track when a subscription is activated
   */
  trackSubscriptionActivated(planId: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'subscription_activated',
      organizationId: orgId,
      planId
    }).catch(err => console.error("Failed to track subscription activation:", err));
  },
  
  /**
   * Track when a subscription is upgraded
   */
  trackSubscriptionUpgraded(newPlanId: string, previousPlanId: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'subscription_upgraded',
      organizationId: orgId,
      planId: newPlanId,
      previousPlanId
    }).catch(err => console.error("Failed to track subscription upgrade:", err));
  },
  
  /**
   * Track when a subscription is cancelled
   */
  trackSubscriptionCancelled(planId: string, orgId?: string, reason?: string): void {
    this.trackEvent({
      eventType: 'subscription_cancelled',
      organizationId: orgId,
      planId,
      additionalData: reason ? { reason } : undefined
    }).catch(err => console.error("Failed to track subscription cancellation:", err));
  },
  
  /**
   * Track when a trial banner is clicked
   */
  trackTrialBannerClicked(daysLeft: number, orgId?: string): void {
    this.trackEvent({
      eventType: 'trial_banner_clicked',
      organizationId: orgId,
      additionalData: { daysLeft }
    }).catch(err => console.error("Failed to track trial banner click:", err));
  }
};
