
import { supabase } from "@/integrations/supabase/client";

// Define valid event types
export type SubscriptionEventType = 
  | 'trial_started' 
  | 'trial_banner_clicked' 
  | 'banner_dismissed' 
  | 'trial_expired_action' 
  | 'trial_extension_requested'
  | 'checkout_initiated' 
  | 'checkout_completed' 
  | 'checkout_abandoned' 
  | 'payment_failed' 
  | 'subscription_activated' 
  | 'subscription_canceled' 
  | 'subscription_renewed'
  | 'payment_status'
  | 'customer_portal_access'
  | 'admin_panel_view'
  | 'subscription_page_view'
  | 'premium_feature_clicked'
  | 'email_notification_sent';

export interface SubscriptionEvent {
  eventType: SubscriptionEventType;
  organizationId: string;
  userId?: string;
  planId?: string;
  additionalData?: Record<string, any>;
}

export const subscriptionAnalyticsService = {
  /**
   * Track a subscription-related event
   */
  trackEvent: async (event: SubscriptionEvent): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("subscription_events")
        .insert({
          event_type: event.eventType,
          organization_id: event.organizationId,
          user_id: event.userId,
          plan_id: event.planId,
          additional_data: event.additionalData || {}
        });
      
      if (error) {
        console.error("Error tracking subscription event:", error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Error in subscription analytics:", err);
      return false;
    }
  },
  
  /**
   * Track checkout initiation
   */
  trackCheckoutInitiated: (planId: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsService.trackEvent({
      eventType: 'checkout_initiated',
      organizationId,
      planId
    });
  },
  
  /**
   * Track checkout completion
   */
  trackCheckoutCompleted: (planId: string, organizationId: string, transactionData: any): Promise<boolean> => {
    return subscriptionAnalyticsService.trackEvent({
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
    return subscriptionAnalyticsService.trackEvent({
      eventType: 'trial_started',
      organizationId
    });
  },

  /**
   * Track payment failure
   */
  trackPaymentFailed: (planId: string, reason: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsService.trackEvent({
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
    return subscriptionAnalyticsService.trackEvent({
      eventType: 'subscription_activated',
      organizationId,
      planId
    });
  },

  /**
   * Track email notification sent
   */
  trackEmailNotificationSent: (type: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsService.trackEvent({
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
    
    return subscriptionAnalyticsService.trackEvent({
      eventType: 'admin_panel_view',
      organizationId,
      additionalData: { section }
    });
  },

  /**
   * Track feature impression
   */
  trackFeatureImpression: (feature: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsService.trackEvent({
      eventType: 'premium_feature_clicked',
      organizationId,
      additionalData: { feature, action: 'impression' }
    });
  },

  /**
   * Track plan selected
   */
  trackPlanSelected: (planId: string, organizationId: string): Promise<boolean> => {
    return subscriptionAnalyticsService.trackEvent({
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
    return subscriptionAnalyticsService.trackEvent({
      eventType: 'trial_extension_requested',
      organizationId,
      additionalData: { reason }
    });
  },

  /**
   * Get analytics by event type
   */
  getAnalyticsByEventType: async (): Promise<Record<string, number>> => {
    try {
      const { data, error } = await supabase
        .from("subscription_events")
        .select('event_type');
      
      if (error) {
        console.error("Error fetching subscription events:", error);
        return {};
      }
      
      // Count occurrences of each event type
      const eventCounts: Record<string, number> = {};
      data.forEach(event => {
        const eventType = event.event_type;
        eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
      });
      
      return eventCounts;
    } catch (err) {
      console.error("Error in getting analytics by event type:", err);
      return {};
    }
  },
  
  /**
   * Get feature conversion analytics
   */
  getFeatureConversionAnalytics: async (): Promise<{ feature: string; conversions: number }[]> => {
    try {
      // Get all feature click events
      const { data, error } = await supabase
        .from("subscription_events")
        .select('*')
        .eq('event_type', 'premium_feature_clicked');
      
      if (error) {
        console.error("Error fetching feature conversion events:", error);
        return [];
      }
      
      // Count conversions by feature
      const featureConversions: Record<string, number> = {};
      data.forEach(event => {
        const feature = event.additional_data?.feature || 'unknown';
        featureConversions[feature] = (featureConversions[feature] || 0) + 1;
      });
      
      // Convert to array format
      return Object.entries(featureConversions).map(([feature, conversions]) => ({
        feature,
        conversions
      })).sort((a, b) => b.conversions - a.conversions);
    } catch (err) {
      console.error("Error in getting feature conversion analytics:", err);
      return [];
    }
  },
  
  /**
   * Get trial conversion metrics
   */
  getTrialConversionMetrics: async (): Promise<{ totalTrials: number; totalConversions: number; conversionRate: string }> => {
    try {
      // Get count of trial started events
      const { data: trialData, error: trialError } = await supabase
        .from("subscription_events")
        .select('id')
        .eq('event_type', 'trial_started');
      
      if (trialError) {
        console.error("Error fetching trial events:", trialError);
        return { totalTrials: 0, totalConversions: 0, conversionRate: '0.00' };
      }
      
      // Get count of subscription activated events
      const { data: conversionData, error: conversionError } = await supabase
        .from("subscription_events")
        .select('id')
        .eq('event_type', 'subscription_activated');
      
      if (conversionError) {
        console.error("Error fetching conversion events:", conversionError);
        return { totalTrials: 0, totalConversions: 0, conversionRate: '0.00' };
      }
      
      const totalTrials = trialData?.length || 0;
      const totalConversions = conversionData?.length || 0;
      
      // Calculate conversion rate
      const conversionRate = totalTrials > 0 
        ? ((totalConversions / totalTrials) * 100).toFixed(2)
        : '0.00';
      
      return { totalTrials, totalConversions, conversionRate };
    } catch (err) {
      console.error("Error in getting trial conversion metrics:", err);
      return { totalTrials: 0, totalConversions: 0, conversionRate: '0.00' };
    }
  }
};
