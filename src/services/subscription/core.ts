
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionEvent } from "./types";

/**
 * Core subscription analytics functions
 */
export const subscriptionAnalyticsCore = {
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
  }
};
