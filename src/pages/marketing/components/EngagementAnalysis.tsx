
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Kol } from "@/hooks/useKols";

interface EngagementAnalysisProps {
  timeFilter: string;
  kols: Kol[];
}

export const EngagementAnalysis: React.FC<EngagementAnalysisProps> = ({ timeFilter, kols }) => {
  // Prepare data for chart - take top 10 KOLs by engagement
  const engagementData = kols
    .filter(kol => kol.engagement)
    .sort((a, b) => (b.engagement || 0) - (a.engagement || 0))
    .slice(0, 10)
    .map(kol => ({
      name: kol.name,
      engagement: kol.engagement || 0
    }));
  
  // Calculate average engagement
  const averageEngagement = kols.length === 0 
    ? 0 
    : kols.reduce((sum, kol) => sum + (kol.engagement || 0), 0) / kols.length;
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Engagement Rate Analysis</CardTitle>
        <CardDescription>
          Engagement rate overview for KOLs across platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="font-bold text-2xl">{averageEngagement.toFixed(2)}%</div>
              <div className="text-sm text-gray-500">Average engagement rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="font-bold text-2xl">{kols.length > 0 ? (kols.reduce((max, kol) => Math.max(max, kol.engagement || 0), 0)).toFixed(2) : '0.00'}%</div>
              <div className="text-sm text-gray-500">Highest engagement rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="font-bold text-2xl">{kols.filter(kol => (kol.engagement || 0) > 3).length}</div>
              <div className="text-sm text-gray-500">KOLs with >3% engagement</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={engagementData}
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
              <Tooltip />
              <Legend />
              <Bar dataKey="engagement" name="Engagement Rate (%)" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
