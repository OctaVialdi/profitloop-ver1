
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

export interface AnalyticsMetrics {
  totalTrials: number; 
  totalConversions: number; 
  conversionRate: string;
}

export interface FeatureConversionData {
  feature: string;
  conversions: number;
}

export interface EventCountData {
  [eventType: string]: number;
}
