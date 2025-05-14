
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Kol, KolMetrics } from "@/hooks/useKols";

interface ConversionMetricsProps {
  timeFilter: string;
  kols: Kol[];
  metrics: KolMetrics[];
}

export const ConversionMetrics: React.FC<ConversionMetricsProps> = ({ timeFilter, kols, metrics }) => {
  // Combine KOLs with their metrics data
  const kolsWithMetrics = kols.map(kol => {
    const kolMetrics = metrics.find(m => m.kol_id === kol.id);
    const clicks = kolMetrics ? kolMetrics.clicks : 0;
    const purchases = kolMetrics ? kolMetrics.purchases : 0;
    const conversionRate = clicks > 0 ? (purchases / clicks) * 100 : 0;
    
    return {
      name: kol.name,
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      clicks,
      purchases
    };
  });
  
  // Sort by conversion rate and take top 10
  const sortedData = [...kolsWithMetrics]
    .filter(item => item.conversionRate > 0)
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 10);
  
  // Calculate total clicks and purchases
  const totalClicks = kolsWithMetrics.reduce((sum, item) => sum + item.clicks, 0);
  const totalPurchases = kolsWithMetrics.reduce((sum, item) => sum + item.purchases, 0);
  const overallConversionRate = totalClicks > 0 ? (totalPurchases / totalClicks) * 100 : 0;
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Conversion Metrics</CardTitle>
        <CardDescription>
          Conversion metrics for KOL campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="font-bold text-2xl">{totalClicks.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Clicks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="font-bold text-2xl">{totalPurchases.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Purchases</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="font-bold text-2xl">{overallConversionRate.toFixed(2)}%</div>
              <div className="text-sm text-gray-500">Average Conversion Rate</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                interval={0}
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="conversionRate" 
                name="Conversion Rate (%)" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
