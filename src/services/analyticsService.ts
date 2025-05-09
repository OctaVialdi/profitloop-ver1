
import { supabase } from "@/integrations/supabase/client";

/**
 * Track a trial-related event for analytics
 * @param event_type The type of event to track
 * @param data Additional data to include in the event
 */
export async function trackTrialEvent(
  event_type: string,
  organization_id: string,
  additional_data?: Record<string, any>
): Promise<boolean> {
  try {
    // Call the track-event edge function
    const { error } = await supabase.functions.invoke('track-event', {
      body: {
        event_type,
        organization_id,
        additional_data
      }
    });
    
    if (error) {
      console.error(`Error tracking trial event ${event_type}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to track trial event ${event_type}:`, error);
    return false;
  }
}

/**
 * Get subscription analytics for an organization
 * @param organization_id The organization ID to get analytics for
 * @param days Number of days to look back (default: 30)
 */
export async function getSubscriptionAnalytics(
  organization_id: string, 
  days: number = 30
): Promise<any> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('subscription_analytics')
      .select('*')
      .eq('organization_id', organization_id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching subscription analytics:", error);
      throw error;
    }
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error in getSubscriptionAnalytics:", error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}

/**
 * Track a feature access attempt
 */
export async function trackFeatureAccess(
  organization_id: string,
  feature_name: string,
  access_granted: boolean
): Promise<boolean> {
  return trackTrialEvent(
    access_granted ? 'feature_access_granted' : 'feature_access_denied',
    organization_id,
    { feature_name }
  );
}

/**
 * Track subscription page view
 */
export async function trackSubscriptionPageView(
  organization_id: string
): Promise<boolean> {
  return trackTrialEvent('subscription_page_view', organization_id);
}
