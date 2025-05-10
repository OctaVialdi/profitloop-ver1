
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface AnalyticsEvent {
  organizationId?: string;
  userId?: string;
  eventType: string;
  eventData: Record<string, any>;
  source?: string;
}

interface PremiumFeatureInteraction {
  featureName: string;
  interactionType: 'view' | 'click' | 'upgrade';
  organizationId?: string;
  subscriptionStatus?: 'trial' | 'paid' | 'expired';
}

interface SubscriptionPageView {
  organizationId?: string;
  source?: string; // Where the user came from
  planViewed?: string;
}

interface UpgradeButtonClick {
  organizationId?: string;
  source: string; // Where the upgrade button was clicked from
  featureName?: string;
}

interface CheckoutEvent {
  organizationId?: string;
  planId?: string;
  eventType: 'checkout_started' | 'checkout_completed' | 'checkout_abandoned';
}

interface TrialEvent {
  organizationId?: string;
  eventType: 'trial_started' | 'trial_expiring' | 'trial_expired';
}

/**
 * Track an analytics event
 */
export async function trackAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  try {
    // Get the current user ID if not provided
    let userId = event.userId;
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    // Insert the event into the subscription_analytics table
    const { error } = await supabase
      .from('subscription_analytics')
      .insert({
        organization_id: event.organizationId,
        user_id: userId,
        event_type: event.eventType,
        event_data: event.eventData,
        source: event.source || 'webapp',
      });

    if (error) {
      console.error("Error tracking analytics event:", error);
    }
  } catch (err) {
    // Silently fail for analytics - don't disrupt user experience
    console.error("Error in trackAnalyticsEvent:", err);
  }
}

/**
 * Track when a user interacts with a premium feature
 */
export function trackPremiumFeatureInteraction(interaction: PremiumFeatureInteraction): void {
  trackAnalyticsEvent({
    organizationId: interaction.organizationId,
    eventType: `feature_${interaction.interactionType}`,
    eventData: {
      feature_name: interaction.featureName,
      subscription_status: interaction.subscriptionStatus
    }
  });
}

/**
 * Track when a user views the subscription page
 */
export function trackSubscriptionPageView(data: SubscriptionPageView): void {
  trackAnalyticsEvent({
    organizationId: data.organizationId,
    eventType: 'subscription_page_view',
    eventData: {
      source: data.source,
      plan_viewed: data.planViewed
    }
  });
}

/**
 * Track when a user clicks an upgrade button
 */
export function trackUpgradeButtonClick(data: UpgradeButtonClick): void {
  trackAnalyticsEvent({
    organizationId: data.organizationId,
    eventType: 'upgrade_button_click',
    eventData: {
      source: data.source,
      feature_name: data.featureName
    }
  });
}

/**
 * Track checkout process events
 */
export function trackCheckoutEvent(data: CheckoutEvent): void {
  trackAnalyticsEvent({
    organizationId: data.organizationId,
    eventType: data.eventType,
    eventData: {
      plan_id: data.planId
    }
  });
}

/**
 * Track trial-related events
 */
export function trackTrialEvent(data: TrialEvent): void {
  trackAnalyticsEvent({
    organizationId: data.organizationId,
    eventType: data.eventType,
    eventData: {}
  });
}
