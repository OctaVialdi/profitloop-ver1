
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { subscriptionAnalyticsService } from "@/services/subscription";

export interface AnalyticsData {
  eventCounts: { [key: string]: number } | null;
  featureConversions: { feature: string; conversions: number; }[] | null;
  trialMetrics: { totalTrials: number; totalConversions: number; conversionRate: string; } | null;
  isLoading: boolean;
}

export function useSubscriptionAnalytics(): AnalyticsData {
  const [eventCounts, setEventCounts] = useState<{ [key: string]: number } | null>(null);
  const [featureConversions, setFeatureConversions] = useState<{ feature: string; conversions: number; }[] | null>(null);
  const [trialMetrics, setTrialMetrics] = useState<{ totalTrials: number; totalConversions: number; conversionRate: string; } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch event counts
        const eventCountsData = await subscriptionAnalyticsService.getAnalyticsByEventType();
        setEventCounts(eventCountsData);

        // Fetch feature conversion analytics
        const featureConversionData = await subscriptionAnalyticsService.getFeatureConversionAnalytics();
        setFeatureConversions(featureConversionData);

        // Fetch trial conversion metrics
        const trialConversionMetrics = await subscriptionAnalyticsService.getTrialConversionMetrics();
        setTrialMetrics(trialConversionMetrics);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load analytics data. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return {
    eventCounts,
    featureConversions,
    trialMetrics,
    isLoading
  };
}
