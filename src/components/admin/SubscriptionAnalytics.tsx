import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/chart";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { subscriptionAnalyticsService } from "@/services/subscription"; // Updated import path

const SubscriptionAnalytics = () => {
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

  // Prepare data for charts
  const eventTypeLabels = eventCounts ? Object.keys(eventCounts) : [];
  const eventTypeValues = eventCounts ? Object.values(eventCounts) : [];

  const featureLabels = featureConversions ? featureConversions.map(item => item.feature) : [];
  const featureValues = featureConversions ? featureConversions.map(item => item.conversions) : [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Event Type Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Analitik Tipe Event</CardTitle>
          <CardDescription>Jumlah setiap tipe event</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Info className="mr-2 h-4 w-4 animate-spin" />
              Memuat data...
            </div>
          ) : eventCounts && Object.keys(eventCounts).length > 0 ? (
            <BarChart
              data={{
                labels: eventTypeLabels,
                datasets: [
                  {
                    label: "Jumlah Event",
                    data: eventTypeValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
            />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Tidak ada data event yang tersedia.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Feature Conversion Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Analitik Konversi Fitur</CardTitle>
          <CardDescription>Jumlah konversi per fitur</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Info className="mr-2 h-4 w-4 animate-spin" />
              Memuat data...
            </div>
          ) : featureConversions && featureConversions.length > 0 ? (
            <LineChart
              data={{
                labels: featureLabels,
                datasets: [
                  {
                    label: "Konversi",
                    data: featureValues,
                    fill: false,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                  },
                ],
              }}
            />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Tidak ada data konversi fitur yang tersedia.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Trial Conversion Metrics */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Metrik Konversi Trial</CardTitle>
          <CardDescription>Jumlah total trial, konversi, dan tingkat konversi</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Info className="mr-2 h-4 w-4 animate-spin" />
              Memuat data...
            </div>
          ) : trialMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-lg font-semibold">Total Trial</div>
                <div className="text-2xl font-bold">{trialMetrics.totalTrials}</div>
              </div>
              <div>
                <div className="text-lg font-semibold">Total Konversi</div>
                <div className="text-2xl font-bold">{trialMetrics.totalConversions}</div>
              </div>
              <div>
                <div className="text-lg font-semibold">Tingkat Konversi</div>
                <div className="text-2xl font-bold">{trialMetrics.conversionRate}%</div>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Tidak ada data metrik trial yang tersedia.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionAnalytics;
