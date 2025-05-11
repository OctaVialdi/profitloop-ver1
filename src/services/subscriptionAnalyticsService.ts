
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
  | 'payment_status'
  | 'customer_portal_access'
  | 'email_notification_sent'
  | 'payment_failed'
  | 'admin_panel_view'
  | 'faq_view'
  | 'feature_comparison_view'
  | 'subscription_dashboard_view'
  | 'subscription_success_view'
  | 'conversion_path'
  | 'feature_impression'
  | 'discount_applied'
  | 'discount_rejected';

interface AnalyticsEventPayload {
  eventType: SubscriptionEventType;
  organizationId?: string;
  planId?: string;
  previousPlanId?: string;
  additionalData?: Record<string, any>;
}

// Define type for subscription analytics records
interface SubscriptionAnalyticsRecord {
  id: string;
  event_type: string;
  organization_id: string;
  user_id?: string;
  plan_id?: string;
  previous_plan_id?: string;
  additional_data?: Record<string, any>;
  created_at: string;
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
  },
  
  /**
   * Track when a payment fails
   */
  trackPaymentFailed(planId: string, reason: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'payment_failed',
      organizationId: orgId,
      planId,
      additionalData: { reason }
    }).catch(err => console.error("Failed to track payment failure:", err));
  },
  
  /**
   * Track when a customer accesses the customer portal
   */
  trackCustomerPortalAccess(orgId?: string): void {
    this.trackEvent({
      eventType: 'customer_portal_access',
      organizationId: orgId
    }).catch(err => console.error("Failed to track customer portal access:", err));
  },
  
  /**
   * Track when an email notification is sent
   */
  trackEmailNotificationSent(type: string, orgId?: string, daysLeft?: number): void {
    this.trackEvent({
      eventType: 'email_notification_sent',
      organizationId: orgId,
      additionalData: { 
        type, 
        daysLeft: daysLeft !== undefined ? daysLeft : null
      }
    }).catch(err => console.error("Failed to track email notification:", err));
  },

  /**
   * Track when admin panel is viewed
   */
  trackAdminPanelView(section: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'admin_panel_view',
      organizationId: orgId,
      additionalData: { section }
    }).catch(err => console.error("Failed to track admin panel view:", err));
  },

  /**
   * Track when FAQ page is viewed
   */
  trackFaqView(searchQuery?: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'faq_view',
      organizationId: orgId,
      additionalData: { searchQuery }
    }).catch(err => console.error("Failed to track FAQ view:", err));
  },

  /**
   * Track feature comparison view
   */
  trackFeatureComparisonView(orgId?: string, features?: string[]): void {
    this.trackEvent({
      eventType: 'feature_comparison_view',
      organizationId: orgId,
      additionalData: { features }
    }).catch(err => console.error("Failed to track feature comparison view:", err));
  },

  /**
   * Track subscription dashboard view
   */
  trackSubscriptionDashboardView(orgId?: string): void {
    this.trackEvent({
      eventType: 'subscription_dashboard_view',
      organizationId: orgId
    }).catch(err => console.error("Failed to track subscription dashboard view:", err));
  },

  /**
   * Track subscription success page view
   */
  trackSubscriptionSuccessView(planId: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'subscription_success_view',
      organizationId: orgId,
      planId
    }).catch(err => console.error("Failed to track subscription success view:", err));
  },

  /**
   * Track conversion path
   */
  trackConversionPath(source: string, destination: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'conversion_path',
      organizationId: orgId,
      additionalData: { source, destination }
    }).catch(err => console.error("Failed to track conversion path:", err));
  },

  /**
   * Track feature impressions (when a feature is viewed)
   */
  trackFeatureImpression(featureName: string, location: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'feature_impression',
      organizationId: orgId,
      additionalData: { featureName, location }
    }).catch(err => console.error("Failed to track feature impression:", err));
  },

  /**
   * Track when a discount is applied
   */
  trackDiscountApplied(discountCode: string, planId: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'discount_applied',
      organizationId: orgId,
      planId,
      additionalData: { discountCode }
    }).catch(err => console.error("Failed to track discount application:", err));
  },

  /**
   * Track when a discount is rejected
   */
  trackDiscountRejected(discountCode: string, reason: string, orgId?: string): void {
    this.trackEvent({
      eventType: 'discount_rejected',
      organizationId: orgId,
      additionalData: { discountCode, reason }
    }).catch(err => console.error("Failed to track discount rejection:", err));
  },

  /**
   * Get analytics for a specific organization
   */
  async getOrganizationAnalytics(organizationId: string): Promise<SubscriptionAnalyticsRecord[]> {
    try {
      // Use type casting to handle the subscription_analytics table that now exists
      const { data, error } = await supabase
        .from('subscription_analytics')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false }) as { 
          data: SubscriptionAnalyticsRecord[] | null; 
          error: any 
        };

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Failed to get organization analytics:", error);
      return [];
    }
  },

  /**
   * Get analytics aggregated by event type
   */
  async getAnalyticsByEventType(organizationId?: string, limit: number = 1000): Promise<Record<string, number>> {
    try {
      let query = supabase
        .from('subscription_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }
      
      // Use type casting to handle the subscription_analytics table that now exists
      const { data, error } = await query as {
        data: SubscriptionAnalyticsRecord[] | null;
        error: any
      };

      if (error) throw error;
      return this.aggregateByEventType(data || []);
    } catch (error) {
      console.error("Failed to get analytics by event type:", error);
      return {};
    }
  },

  /**
   * Get feature conversion analytics
   */
  async getFeatureConversionAnalytics(): Promise<any> {
    try {
      // First get all premium_feature_clicked events
      // Use type casting to handle the subscription_analytics table that now exists
      const { data: featureClicks, error: featureError } = await supabase
        .from('subscription_analytics')
        .select('*')
        .eq('event_type', 'premium_feature_clicked') as {
          data: SubscriptionAnalyticsRecord[] | null;
          error: any
        };

      if (featureError) throw featureError;
      
      // Then get all checkout_initiated events
      const { data: checkouts, error: checkoutError } = await supabase
        .from('subscription_analytics')
        .select('*')
        .eq('event_type', 'checkout_initiated') as {
          data: SubscriptionAnalyticsRecord[] | null;
          error: any
        };
        
      if (checkoutError) throw checkoutError;
      
      // Analyze which features lead to conversions
      const featureClicksByUser: Record<string, { features: string[], timestamp: number }> = {};
      const conversionsByFeature: Record<string, number> = {};
      
      // Group feature clicks by user
      (featureClicks || []).forEach(click => {
        const userId = click.user_id;
        const additionalData = click.additional_data as Record<string, any> | null;
        const feature = additionalData?.featureName;
        
        if (!feature || !userId) return;
        
        if (!featureClicksByUser[userId]) {
          featureClicksByUser[userId] = { features: [], timestamp: 0 };
        }
        
        if (!featureClicksByUser[userId].features.includes(feature)) {
          featureClicksByUser[userId].features.push(feature);
        }
        
        const clickTime = new Date(click.created_at).getTime();
        if (clickTime > featureClicksByUser[userId].timestamp) {
          featureClicksByUser[userId].timestamp = clickTime;
        }
      });
      
      // Check which feature clicks led to checkouts
      (checkouts || []).forEach(checkout => {
        const userId = checkout.user_id;
        if (!userId) return;
        
        const checkoutTime = new Date(checkout.created_at).getTime();
        
        if (featureClicksByUser[userId]) {
          const userClicks = featureClicksByUser[userId];
          // Consider feature clicks that happened within 1 hour before checkout
          if (checkoutTime - userClicks.timestamp < 3600000) {
            userClicks.features.forEach(feature => {
              conversionsByFeature[feature] = (conversionsByFeature[feature] || 0) + 1;
            });
          }
        }
      });
      
      return Object.entries(conversionsByFeature)
        .map(([feature, count]) => ({ feature, conversions: count }))
        .sort((a, b) => b.conversions - a.conversions);
    } catch (error) {
      console.error("Failed to get feature conversion analytics:", error);
      return [];
    }
  },
  
  /**
   * Get trial conversion metrics
   */
  async getTrialConversionMetrics(): Promise<any> {
    try {
      // Get all trial_started events
      const { data: trialStarts, error: trialError } = await supabase
        .from('subscription_analytics')
        .select('*')
        .eq('event_type', 'trial_started') as {
          data: SubscriptionAnalyticsRecord[] | null;
          error: any
        };
        
      if (trialError) throw trialError;
      
      // Get all subscription_activated events
      const { data: subscriptions, error: subError } = await supabase
        .from('subscription_analytics')
        .select('*')
        .eq('event_type', 'subscription_activated') as {
          data: SubscriptionAnalyticsRecord[] | null;
          error: any
        };
        
      if (subError) throw subError;
      
      // Count total trials
      const totalTrials = trialStarts?.length || 0;
      
      // Count unique conversions
      const uniqueOrgIds = new Set(subscriptions?.map(sub => sub.organization_id));
      const totalConversions = uniqueOrgIds.size;
      
      // Calculate conversion rate
      const conversionRate = totalTrials > 0 ? (totalConversions / totalTrials) * 100 : 0;
      
      return {
        totalTrials,
        totalConversions,
        conversionRate: conversionRate.toFixed(2)
      };
    } catch (error) {
      console.error("Failed to get trial conversion metrics:", error);
      return { totalTrials: 0, totalConversions: 0, conversionRate: '0.00' };
    }
  },

  /**
   * Helper: Aggregate analytics by event type
   */
  aggregateByEventType(data: SubscriptionAnalyticsRecord[]): Record<string, number> {
    return data.reduce((acc: Record<string, number>, event) => {
      const eventType = event.event_type;
      acc[eventType] = (acc[eventType] || 0) + 1;
      return acc;
    }, {});
  }
};
