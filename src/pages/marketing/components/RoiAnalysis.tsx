
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

interface RoiAnalysisProps {
  timeFilter: string;
}

export const RoiAnalysis = ({ timeFilter }: RoiAnalysisProps) => {
  // ROI data
  const roiByKolData = [
    { name: "Sarah Johnson", value: 75 },
    { name: "Alex Chen", value: 72 },
    { name: "Maria Rodriguez", value: 85 },
    { name: "Emma Wilson", value: 78 },
  ];

  const roiTrendsData = [
    { name: "Jan", value: 50 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 28 },
    { name: "Apr", value: 55 },
    { name: "May", value: 52 },
    { name: "Jun", value: 22 },
    { name: "Jul", value: 52 },
    { name: "Aug", value: 38 },
    { name: "Sep", value: 25 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">ROI by KOL</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiByKolData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">ROI Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={roiTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 60]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#F97316"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
