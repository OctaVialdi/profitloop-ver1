
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart } from 'recharts';
import { subscriptionAnalyticsService } from '@/services/subscriptionAnalyticsService';

export function SubscriptionAnalytics() {
  const [conversionData, setConversionData] = useState<Record<string, number>>({});
  const [featureConversions, setFeatureConversions] = useState<Array<{ feature: string; conversions: number }>>([]);
  const [metrics, setMetrics] = useState<{
    totalTrials: number;
    totalConversions: number;
    conversionRate: string;
  }>({
    totalTrials: 0,
    totalConversions: 0,
    conversionRate: '0%'
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Get trial-to-paid conversion by date
        const signupsData = await subscriptionAnalyticsService.getAnalyticsByEventType('trial_started');
        const processedData: Record<string, number> = {};
        signupsData.data.forEach(item => {
          processedData[item.date] = item.count;
        });
        setConversionData(processedData);
        
        // Get feature conversion data
        const featureData = await subscriptionAnalyticsService.getFeatureConversionAnalytics();
        setFeatureConversions(featureData.data.map(item => ({
          feature: item.feature,
          conversions: item.conversions
        })));
        
        // Get overall metrics
        const trialMetrics = await subscriptionAnalyticsService.getTrialConversionMetrics();
        setMetrics({
          totalTrials: trialMetrics.trialStarted,
          totalConversions: trialMetrics.converted,
          conversionRate: `${trialMetrics.conversionRate.toFixed(1)}%`
        });
      } catch (error) {
        console.error('Error loading analytics data:', error);
      }
    };
    
    loadAnalytics();
  }, []);
  
  const conversionChartData = Object.keys(conversionData).map(date => ({
    date,
    conversions: conversionData[date]
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Subscription Analytics</CardTitle>
        <CardDescription>Subscription and trial conversion metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Trials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalTrials}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalConversions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.conversionRate}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="conversions">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={conversionChartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="conversions" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="features">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={featureConversions}>
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
