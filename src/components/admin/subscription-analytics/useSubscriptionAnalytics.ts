
import { useToast } from "@/components/ui/use-toast";
import { subscriptionAnalyticsService } from "@/services/subscription";
import { useQuery } from "@tanstack/react-query";

export interface AnalyticsData {
  eventCounts: { [key: string]: number } | null;
  featureConversions: { feature: string; conversions: number; }[] | null;
  trialMetrics: { totalTrials: number; totalConversions: number; conversionRate: string; } | null;
  isLoading: boolean;
}

export function useSubscriptionAnalytics(): AnalyticsData {
  const { toast } = useToast();

  // Event counts query
  const eventCountsQuery = useQuery({
    queryKey: ['analytics', 'eventCounts'],
    queryFn: subscriptionAnalyticsService.getAnalyticsByEventType,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    onError: (error) => {
      console.error("Error fetching event counts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load analytics event data."
      });
    }
  });

  // Feature conversion analytics query
  const featureConversionsQuery = useQuery({
    queryKey: ['analytics', 'featureConversions'],
    queryFn: subscriptionAnalyticsService.getFeatureConversionAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    onError: (error) => {
      console.error("Error fetching feature conversions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feature conversion data."
      });
    }
  });

  // Trial conversion metrics query
  const trialMetricsQuery = useQuery({
    queryKey: ['analytics', 'trialMetrics'],
    queryFn: subscriptionAnalyticsService.getTrialConversionMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    onError: (error) => {
      console.error("Error fetching trial metrics:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load trial conversion metrics."
      });
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
