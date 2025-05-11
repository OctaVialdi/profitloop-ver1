
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
  | 'subscription_renewed';

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
  }
};
