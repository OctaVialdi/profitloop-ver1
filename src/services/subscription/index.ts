
import { subscriptionAnalyticsCore } from "./core";
import { subscriptionTrackingService } from "./trackingService";
import { subscriptionAnalyticsService as analyticsService } from "./analyticsService";
import { SubscriptionEvent, SubscriptionEventType } from "./types";

// Export all subscription analytics functionality combined
export const subscriptionAnalyticsService = {
  // Core tracking functionality
  trackEvent: subscriptionAnalyticsCore.trackEvent,
  
  // Tracking service methods
  trackCheckoutInitiated: subscriptionTrackingService.trackCheckoutInitiated,
  trackCheckoutCompleted: subscriptionTrackingService.trackCheckoutCompleted,
  trackTrialStarted: subscriptionTrackingService.trackTrialStarted,
  trackPaymentFailed: subscriptionTrackingService.trackPaymentFailed,
  trackSubscriptionActivated: subscriptionTrackingService.trackSubscriptionActivated,
  trackEmailNotificationSent: subscriptionTrackingService.trackEmailNotificationSent,
  trackAdminPanelView: subscriptionTrackingService.trackAdminPanelView,
  trackFeatureImpression: subscriptionTrackingService.trackFeatureImpression,
  trackPlanSelected: subscriptionTrackingService.trackPlanSelected,
  trackTrialExtensionRequested: subscriptionTrackingService.trackTrialExtensionRequested,
  
  // Analytics service methods
  getAnalyticsByEventType: analyticsService.getAnalyticsByEventType,
  getFeatureConversionAnalytics: analyticsService.getFeatureConversionAnalytics,
  getTrialConversionMetrics: analyticsService.getTrialConversionMetrics,
};

// Re-export types
export type { SubscriptionEvent, SubscriptionEventType };
