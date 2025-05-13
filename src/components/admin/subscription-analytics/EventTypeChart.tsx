
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ChartContainer } from "@/components/ui/chart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface EventTypeChartProps {
  eventCounts: { [key: string]: number } | null;
  isLoading: boolean;
}

const EventTypeChart: React.FC<EventTypeChartProps> = ({ eventCounts, isLoading }) => {
  // Helper function to format data for the chart
  function formatEventTypeData() {
    if (!eventCounts) return [];
    
    return Object.entries(eventCounts).map(([name, value]) => ({
      name,
      value
    }));
  }

  return (
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
          <ChartContainer
            className="h-80"
            config={{
              value: { theme: { light: 'rgba(54, 162, 235, 0.6)', dark: 'rgba(54, 162, 235, 1)' } }
            }}
          >
            <BarChart data={formatEventTypeData()} />
          </ChartContainer>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Tidak ada data event yang tersedia.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default EventTypeChart;
