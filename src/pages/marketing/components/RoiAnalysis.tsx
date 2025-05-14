
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Kol, KolMetrics } from "@/hooks/useKols";

interface RoiAnalysisProps {
  timeFilter: string;
  kols: Kol[];
  metrics: KolMetrics[];
}

export const RoiAnalysis: React.FC<RoiAnalysisProps> = ({ timeFilter, kols, metrics }) => {
  // Combine KOLs with their metrics data
  const kolsWithMetrics = kols.map(kol => {
    const kolMetrics = metrics.find(m => m.kol_id === kol.id);
    const revenue = kolMetrics ? kolMetrics.revenue : 0;
    const cost = kolMetrics ? kolMetrics.cost : 0;
    const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;
    
    return {
      name: kol.name,
      roi: parseFloat(roi.toFixed(1)),
      revenue,
      cost
    };
  });
  
  // Sort by ROI and take top 10
  const sortedData = [...kolsWithMetrics]
    .filter(item => item.roi > 0)
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 10);
  
  // Calculate total revenue and cost
  const totalRevenue = kolsWithMetrics.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = kolsWithMetrics.reduce((sum, item) => sum + item.cost, 0);
  const averageROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>ROI & Revenue Analysis</CardTitle>
        <CardDescription>
          Return on investment across all KOLs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="font-bold text-2xl">{formatCurrency(totalRevenue)}</div>
              <div className="text-sm text-gray-500">Total Revenue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="font-bold text-2xl">{formatCurrency(totalCost)}</div>
              <div className="text-sm text-gray-500">Total Cost</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="font-bold text-2xl">{averageROI.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Average ROI</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
              <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
              <Legend />
              <Bar dataKey="roi" name="ROI (%)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
