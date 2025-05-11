
import { subscriptionAnalyticsCore } from "./core";
import { SubscriptionEvent } from "./types";

/**
 * Subscription tracking service for various events
 */
export const subscriptionTrackingService = {
  /**
   * Track checkout initiation
   */
  trackCheckoutInitiated: (planId: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsCore.trackEvent({
      eventType: 'checkout_initiated',
      organizationId,
      planId
    });
  },
  
  /**
   * Track checkout completion
   */
  trackCheckoutCompleted: (planId: string, organizationId: string, transactionData: any): Promise<boolean> => {
    return subscriptionAnalyticsCore.trackEvent({
      eventType: 'checkout_completed',
      organizationId,
      planId,
      additionalData: { transaction: transactionData }
    });
  },

  /**
   * Track trial start
   */
  trackTrialStarted: (organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsCore.trackEvent({
      eventType: 'trial_started',
      organizationId
    });
  },

  /**
   * Track payment failure
   */
  trackPaymentFailed: (planId: string, reason: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsCore.trackEvent({
      eventType: 'payment_failed',
      organizationId,
      planId,
      additionalData: { reason }
    });
  },

  /**
   * Track subscription activation
   */
  trackSubscriptionActivated: (planId: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsCore.trackEvent({
      eventType: 'subscription_activated',
      organizationId,
      planId
    });
  },

  /**
   * Track email notification sent
   */
  trackEmailNotificationSent: (type: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsCore.trackEvent({
      eventType: 'email_notification_sent',
      organizationId,
      additionalData: { type }
    });
  },

  /**
   * Track admin panel view
   */
  trackAdminPanelView: (section: string, organizationId?: string | null): Promise<boolean> => {
    if (!organizationId) return Promise.resolve(false);
    
    return subscriptionAnalyticsCore.trackEvent({
      eventType: 'admin_panel_view',
      organizationId,
      additionalData: { section }
    });
  },

  /**
   * Track feature impression
   */
  trackFeatureImpression: (feature: string, context: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsCore.trackEvent({
      eventType: 'premium_feature_clicked',
      organizationId,
      additionalData: { feature, context, action: 'impression' }
    });
  },

  /**
   * Track plan selected
   */
  trackPlanSelected: (planId: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsCore.trackEvent({
      eventType: 'premium_feature_clicked',
      organizationId,
      planId,
      additionalData: { feature: 'plan_selection' }
    });
  },

  /**
   * Track trial extension request
   */
  trackTrialExtensionRequested: (reason: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsCore.trackEvent({
      eventType: 'trial_extension_requested',
      organizationId,
      additionalData: { reason }
    });
  }
};
