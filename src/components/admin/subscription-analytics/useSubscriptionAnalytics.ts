
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/hooks/use-toast";
import { subscriptionAnalyticsService } from "@/services/subscription";
import { useQuery } from "@tanstack/react-query";

export interface AnalyticsData {
  eventCounts: { [key: string]: number } | null;
  featureConversions: { feature: string; conversions: number; }[] | null;
  trialMetrics: { totalTrials: number; totalConversions: number; conversionRate: string; } | null;
  isLoading: boolean;
}

export function useSubscriptionAnalytics(): AnalyticsData {
  // Event counts query
  const eventCountsQuery = useQuery({
    queryKey: ['analytics', 'eventCounts'],
    queryFn: subscriptionAnalyticsService.getAnalyticsByEventType,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching event counts:", error);
        toast.error("Failed to load analytics event data.");
      }
    }
  });

  // Feature conversion analytics query
  const featureConversionsQuery = useQuery({
    queryKey: ['analytics', 'featureConversions'],
    queryFn: subscriptionAnalyticsService.getFeatureConversionAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching feature conversions:", error);
        toast.error("Failed to load feature conversion data.");
      }
    }
  });

  // Trial conversion metrics query
  const trialMetricsQuery = useQuery({
    queryKey: ['analytics', 'trialMetrics'],
    queryFn: subscriptionAnalyticsService.getTrialConversionMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching trial metrics:", error);
        toast.error("Failed to load trial conversion metrics.");
      }
    }
  });

  const isLoading = 
    eventCountsQuery.isLoading || 
    featureConversionsQuery.isLoading || 
    trialMetricsQuery.isLoading;

  return {
    eventCounts: eventCountsQuery.data || null,
    featureConversions: featureConversionsQuery.data || null,
    trialMetrics: trialMetricsQuery.data || null,
    isLoading
  };
}
