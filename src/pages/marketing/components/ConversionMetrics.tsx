
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  LineChart,
} from "recharts";

interface ConversionMetricsProps {
  timeFilter: string;
}

export const ConversionMetrics = ({ timeFilter }: ConversionMetricsProps) => {
  // Conversion data
  const conversionByKolData = [
    { name: "Sarah Johnson", value: 310 },
    { name: "Alex Chen", value: 265 },
    { name: "Maria Rodriguez", value: 450 },
    { name: "Emma Wilson", value: 360 },
  ];

  const conversionTrendsData = [
    { name: "Jan", value: 9 },
    { name: "Feb", value: 8.5 },
    { name: "Mar", value: 7 },
    { name: "Apr", value: 3 },
    { name: "May", value: 6.5 },
    { name: "Jun", value: 7.5 },
    { name: "Jul", value: 2.5 },
    { name: "Aug", value: 9.5 },
    { name: "Sep", value: 4.5 },
  ];

  const topPerformersData = [
    { id: 1, name: "Sarah Johnson", score: 78 },
    { id: 2, name: "Alex Chen", score: 72 },
    { id: 3, name: "Maria Rodriguez", score: 86 },
    { id: 4, name: "David Kim", score: 65 },
    { id: 5, name: "Emma Wilson", score: 81 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Conversion Rate by KOL</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionByKolData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis domain={[0, 600]} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Conversion Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 12]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Top Performers</h3>
            <div className="space-y-3">
              {topPerformersData.map((performer) => (
                <div key={performer.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      {performer.id}
                    </div>
                    <span className="font-medium">{performer.name}</span>
                  </div>
                  <span className="font-semibold">{performer.score} <span className="text-gray-500 text-sm font-normal">score</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* New section with header */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Additional Conversion Insights</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <p className="text-gray-600">This section will contain additional conversion metrics and insights.</p>
        </div>
      </div>
    </div>
  );
};
