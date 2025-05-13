
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, ChartContainer } from "@/components/ui/chart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface FeatureConversionChartProps {
  featureConversions: { feature: string; conversions: number; }[] | null;
  isLoading: boolean;
}

const FeatureConversionChart: React.FC<FeatureConversionChartProps> = ({ featureConversions, isLoading }) => {
  // Helper function to format data for the chart
  function formatFeatureData() {
    if (!featureConversions) return [];
    
    return featureConversions.map(item => ({
      name: item.feature,
      value: item.conversions
    }));
  }

  return (
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
          <ChartContainer 
            className="h-80"
            config={{
              value: { theme: { light: 'rgba(75, 192, 192, 0.2)', dark: 'rgba(75, 192, 192, 1)' } }
            }}
          >
            <LineChart data={formatFeatureData()} />
          </ChartContainer>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Tidak ada data konversi fitur yang tersedia.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureConversionChart;
