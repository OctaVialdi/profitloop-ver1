
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  LineChart,
} from "recharts";

interface EngagementAnalysisProps {
  timeFilter: string;
}

export const EngagementAnalysis = ({ timeFilter }: EngagementAnalysisProps) => {
  // Sample data for the charts
  const distributionData = [
    { name: "Sarah Johnson", value: 310 },
    { name: "Alex Chen", value: 265 },
    { name: "Maria Rodriguez", value: 450 },
    { name: "Emma Wilson", value: 360 },
  ];

  const timeData = [
    { name: "Jan", value: 4.0 },
    { name: "Feb", value: 4.8 },
    { name: "Mar", value: 3.5 },
    { name: "Apr", value: 1.9 },
    { name: "May", value: 3.8 },
    { name: "Jun", value: 5.2 },
    { name: "Jul", value: 5.5 },
    { name: "Aug", value: 3.9 },
    { name: "Sep", value: 2.2 },
  ];

  const categoryData = [
    { name: "Beauty", value: 1 },
    { name: "Tech", value: 1 },
    { name: "Fitness", value: 1 },
    { name: "Fashion", value: 1 },
    { name: "Food", value: 1 },
  ];

  // ROI data based on the image
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Engagement Rate Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis />
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
                  <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Engagement Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
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
                    stroke="#7E69AB"
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
            <h3 className="text-lg font-medium mb-4">Top Categories</h3>
            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-[#9b87f5] rounded-full"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adding ROI charts based on the image */}
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
