
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsMetrics, EventCountData, FeatureConversionData } from "./types";

/**
 * Subscription analytics service for reports and metrics
 */
export const subscriptionAnalyticsService = {
  /**
   * Get analytics by event type
   */
  getAnalyticsByEventType: async (): Promise<EventCountData> => {
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
  getFeatureConversionAnalytics: async (): Promise<FeatureConversionData[]> => {
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
        // Fix type error with proper type assertion
        const feature = (event.additional_data as Record<string, any>)?.feature || 'unknown';
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
  getTrialConversionMetrics: async (): Promise<AnalyticsMetrics> => {
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
