
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsService } from "@/services/analyticsService";
import { BarChart, LineChart } from "@/components/ui/charts";
import { useOrganization } from "@/hooks/useOrganization";

export function SubscriptionAnalytics() {
  const { organization } = useOrganization();
  const [eventData, setEventData] = useState<Record<string, number>>({});
  const [conversionData, setConversionData] = useState<{ feature: string; conversions: number }[]>([]);
  const [trialMetrics, setTrialMetrics] = useState<{
    totalTrials: number;
    totalConversions: number;
    conversionRate: string;
  }>({
    totalTrials: 0,
    totalConversions: 0,
    conversionRate: "0%"
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Get event analytics by type
        const eventsResult = await analyticsService.getAnalyticsByEventType("subscription");
        if (eventsResult?.data) {
          const transformedData: Record<string, number> = {};
          eventsResult.data.forEach(item => {
            transformedData[item.date] = item.count;
          });
          setEventData(transformedData);
        }

        // Get feature conversion analytics
        const featureResult = await analyticsService.getFeatureConversionAnalytics();
        if (featureResult?.data) {
          const transformedConversions = featureResult.data.map(item => ({
            feature: item.feature,
            conversions: item.conversions
          }));
          setConversionData(transformedConversions);
        }

        // Get trial conversion metrics
        const trialResult = await analyticsService.getTrialConversionMetrics();
        if (trialResult) {
          setTrialMetrics({
            totalTrials: trialResult.trialStarted || 0,
            totalConversions: trialResult.converted || 0,
            conversionRate: `${Math.round((trialResult.conversionRate || 0) * 100)}%`
          });
        }
      } catch (error) {
        console.error("Error loading analytics data:", error);
      }
    };

    loadAnalytics();
  }, [organization?.id]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-xl">Trial Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Total Trials</p>
              <p className="text-2xl font-bold">{trialMetrics.totalTrials}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Conversions</p>
              <p className="text-2xl font-bold">{trialMetrics.totalConversions}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold">{trialMetrics.conversionRate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-xl">Subscription Events</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <LineChart
            data={Object.entries(eventData).map(([date, count]) => ({ name: date, value: count }))}
            index="name"
            categories={["value"]}
            colors={["blue"]}
            yAxisWidth={40}
          />
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="text-xl">Feature Conversions</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <BarChart
            data={conversionData}
            index="feature"
            categories={["conversions"]}
            colors={["blue"]}
            yAxisWidth={48}
          />
        </CardContent>
      </Card>
    </div>
  );
}
