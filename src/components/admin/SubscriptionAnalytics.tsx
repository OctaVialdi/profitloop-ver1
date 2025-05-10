
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyticsService } from "@/services/analyticsService";
import { SimpleBarChart, SimpleLineChart, SimplePieChart } from "@/components/ui/charts";

export function SubscriptionAnalytics() {
  const [dailySignups, setDailySignups] = useState<Record<string, number>>({});
  const [conversionsByFeature, setConversionsByFeature] = useState<Array<{ feature: string; conversions: number }>>([]);
  const [summary, setSummary] = useState<{
    totalTrials: number;
    totalConversions: number;
    conversionRate: string;
  }>({
    totalTrials: 0,
    totalConversions: 0,
    conversionRate: "0%",
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch daily signups
        const signupsResponse = await analyticsService.getSubscriptionSignups();
        
        const signupsData: Record<string, number> = {};
        signupsResponse.data.forEach((item: { date: string; count: number }) => {
          signupsData[item.date] = item.count;
        });
        setDailySignups(signupsData);
        
        // Fetch conversions by feature
        const featuresResponse = await analyticsService.getFeatureConversions();
        setConversionsByFeature(featuresResponse.data);
        
        // Fetch summary
        const summaryResponse = await analyticsService.getConversionSummary();
        setSummary({
          totalTrials: summaryResponse.trialStarted || 0,
          totalConversions: summaryResponse.converted || 0,
          conversionRate: `${summaryResponse.conversionRate || 0}%`,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);
  
  // Format data for charts
  const formatDailySignups = () => {
    return Object.keys(dailySignups).map(date => ({
      date,
      signups: dailySignups[date]
    }));
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">Total Trial Signups</p>
              <h3 className="text-2xl font-bold">{summary.totalTrials}</h3>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">Paid Conversions</p>
              <h3 className="text-2xl font-bold">{summary.totalConversions}</h3>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <h3 className="text-2xl font-bold">{summary.conversionRate}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signups">
            <TabsList className="mb-6">
              <TabsTrigger value="signups">Trial Signups</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            <TabsContent value="signups" className="space-y-4">
              <div className="h-[350px]">
                <SimpleBarChart
                  data={formatDailySignups()}
                  xKey="date"
                  yKey="signups"
                  color="#3b82f6"
                  height={350}
                />
              </div>
            </TabsContent>
            <TabsContent value="features" className="space-y-4">
              <div className="h-[350px]">
                <SimplePieChart
                  data={conversionsByFeature}
                  nameKey="feature"
                  valueKey="conversions"
                  height={350}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
