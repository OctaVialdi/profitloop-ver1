
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionEventType = 
  | "trial_started" 
  | "trial_extended" 
  | "subscription_started" 
  | "subscription_cancelled" 
  | "subscription_changed"
  | "payment_status"
  | "customer_portal_access"
  | "payment_failed";

/**
 * Service for tracking subscription-related events
 */
export const subscriptionAnalyticsService = {
  /**
   * Track when a trial starts
   * @param organizationId The organization ID
   */
  trackTrialStarted: async (organizationId: string): Promise<void> => {
    try {
      await supabase
        .from('subscription_analytics')
        .insert({
          organization_id: organizationId,
          event_type: 'trial_started'
        });
    } catch (error) {
      console.error('Error tracking trial start:', error);
    }
  },

  /**
   * Track when a user starts a subscription
   * @param organizationId The organization ID
   * @param planId The plan ID
   * @param paymentMethod Optional payment method info
   */
  trackSubscriptionStarted: async (
    organizationId: string, 
    planId: string,
    paymentMethod?: string
  ): Promise<void> => {
    try {
      await supabase
        .from('subscription_analytics')
        .insert({
          organization_id: organizationId,
          event_type: 'subscription_started',
          plan_id: planId,
          payment_method: paymentMethod
        });
    } catch (error) {
      console.error('Error tracking subscription start:', error);
    }
  },
  
  /**
   * Track when a user cancels their subscription
   * @param organizationId The organization ID
   * @param planId The plan ID being canceled
   */
  trackSubscriptionCancelled: async (
    organizationId: string,
    planId: string
  ): Promise<void> => {
    try {
      await supabase
        .from('subscription_analytics')
        .insert({
          organization_id: organizationId,
          event_type: 'subscription_cancelled',
          plan_id: planId
        });
    } catch (error) {
      console.error('Error tracking subscription cancellation:', error);
    }
  },
  
  /**
   * Track when a user changes their subscription plan
   * @param organizationId The organization ID
   * @param planId The new plan ID
   * @param previousPlanId The previous plan ID
   */
  trackSubscriptionChanged: async (
    organizationId: string,
    planId: string,
    previousPlanId: string
  ): Promise<void> => {
    try {
      await supabase
        .from('subscription_analytics')
        .insert({
          organization_id: organizationId,
          event_type: 'subscription_changed',
          plan_id: planId,
          previous_plan_id: previousPlanId
        });
    } catch (error) {
      console.error('Error tracking subscription change:', error);
    }
  },
  
  /**
   * Track when a trial is extended
   * @param organizationId The organization ID
   * @param additionalData Additional data about the extension
   */
  trackTrialExtended: async (
    organizationId: string,
    additionalData?: Record<string, any>
  ): Promise<void> => {
    try {
      await supabase
        .from('subscription_analytics')
        .insert({
          organization_id: organizationId,
          event_type: 'trial_extended',
          additional_data: additionalData
        });
    } catch (error) {
      console.error('Error tracking trial extension:', error);
    }
  },
  
  /**
   * Track generic subscription event
   * @param organizationId The organization ID
   * @param eventType The event type
   * @param additionalData Additional data to store with the event
   */
  trackEvent: async (
    organizationId: string,
    eventType: SubscriptionEventType,
    additionalData?: Record<string, any>
  ): Promise<void> => {
    try {
      await supabase
        .from('subscription_analytics')
        .insert({
          organization_id: organizationId,
          event_type: eventType,
          additional_data: additionalData
        });
    } catch (error) {
      console.error(`Error tracking ${eventType} event:`, error);
    }
  }
};
