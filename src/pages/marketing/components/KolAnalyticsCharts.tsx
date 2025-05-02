
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { 
  Area,
  AreaChart, 
  Bar, 
  BarChart,
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Mock data for charts
const engagementData = [
  { name: 'Sarah Johnson', value: 315 },
  { name: 'Alex Chen', value: 280 },
  { name: 'Maria Rodriguez', value: 450 },
  { name: 'Emma Wilson', value: 380 }
];

const roiData = [
  { name: 'Sarah Johnson', value: 78 },
  { name: 'Alex Chen', value: 72 },
  { name: 'Maria Rodriguez', value: 85 },
  { name: 'Emma Wilson', value: 79 }
];

const conversionData = [
  { name: 'Sarah Johnson', value: 310 },
  { name: 'Alex Chen', value: 280 },
  { name: 'Maria Rodriguez', value: 450 },
  { name: 'Emma Wilson', value: 370 }
];

const timeSeriesData = [
  { month: 'Jan', engagement: 2, roi: 35, conversion: 4 },
  { month: 'Feb', engagement: 3, roi: 42, conversion: 5 },
  { month: 'Mar', engagement: 4.5, roi: 50, conversion: 8 },
  { month: 'Apr', engagement: 5.8, roi: 70, conversion: 8.3 },
  { month: 'May', engagement: 5.5, roi: 32, conversion: 3.5 },
  { month: 'Jun', engagement: 4, roi: 55, conversion: 5.8 },
  { month: 'Jul', engagement: 3.8, roi: 62, conversion: 3 },
  { month: 'Aug', engagement: 4.2, roi: 65, conversion: 4.5 },
  { month: 'Sep', engagement: 3.5, roi: 40, conversion: 9.6 }
];

const topCategories = [
  { name: "Beauty", value: 10 },
  { name: "Tech", value: 10 },
  { name: "Fitness", value: 10 },
  { name: "Fashion", value: 10 },
  { name: "Food", value: 10 }
];

const topPerformers = [
  { id: 1, name: "Sarah Johnson", score: 78 },
  { id: 2, name: "Alex Chen", score: 72 },
  { id: 3, name: "Maria Rodriguez", score: 86 },
  { id: 4, name: "David Kim", score: 65 },
  { id: 5, name: "Emma Wilson", score: 81 }
];

const config = {
  engagement: {
    label: "Engagement",
    theme: {
      light: '#9b87f5',
      dark: '#9b87f5',
    }
  },
  roi: {
    label: "ROI",
    theme: {
      light: '#f97316',
      dark: '#f97316',
    }
  },
  conversion: {
    label: "Conversion",
    theme: {
      light: '#0EA5E9',
      dark: '#0EA5E9',
    }
  }
};

const KolAnalyticsCharts = () => {
  const [activeMetricTab, setActiveMetricTab] = useState("engagement");
  
  return (
    <div className="space-y-6">
      <Tabs value={activeMetricTab} onValueChange={setActiveMetricTab} className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="engagement">Engagement Analysis</TabsTrigger>
          <TabsTrigger value="roi">ROI & Revenue</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Engagement Rate Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={config} className="h-80">
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip 
                      content={<ChartTooltipContent />} 
                      cursor={{ fill: 'rgba(155, 135, 245, 0.1)' }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#9b87f5"
                      radius={[4, 4, 0, 0]}
                      name="Engagement"
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={config} className="h-80">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip 
                      content={<ChartTooltipContent />} 
                      cursor={{ stroke: 'rgba(155, 135, 245, 0.1)', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#9b87f5"
                      strokeWidth={2}
                      dot={{ stroke: '#9b87f5', strokeWidth: 2, fill: 'white', r: 4 }}
                      activeDot={{ stroke: '#9b87f5', strokeWidth: 2, fill: '#9b87f5', r: 4 }}
                      name="Engagement Rate"
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCategories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div>{category.name}</div>
                      <div className="flex items-center gap-4">
                        <div className="w-36 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#9b87f5] h-2 rounded-full"
                            style={{ width: `${category.value * 10}%` }}
                          />
                        </div>
                        <div className="text-sm font-medium">1</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roi" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">ROI by KOL</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={config} className="h-80">
                  <BarChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip 
                      content={<ChartTooltipContent />} 
                      cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                      name="ROI"
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">ROI Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={config} className="h-80">
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip 
                      content={<ChartTooltipContent />} 
                      cursor={{ stroke: 'rgba(249, 115, 22, 0.1)', strokeWidth: 2 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="roi"
                      stroke="#f97316"
                      fill="rgba(249, 115, 22, 0.1)"
                      strokeWidth={2}
                      name="ROI"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Conversion Rate by KOL</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={config} className="h-80">
                  <BarChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip 
                      content={<ChartTooltipContent />} 
                      cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#0EA5E9"
                      radius={[4, 4, 0, 0]}
                      name="Conversion"
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Conversion Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={config} className="h-80">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip 
                      content={<ChartTooltipContent />} 
                      cursor={{ stroke: 'rgba(14, 165, 233, 0.1)', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="conversion"
                      stroke="#0EA5E9"
                      strokeWidth={2}
                      dot={{ stroke: '#0EA5E9', strokeWidth: 2, fill: 'white', r: 4 }}
                      activeDot={{ stroke: '#0EA5E9', strokeWidth: 2, fill: '#0EA5E9', r: 4 }}
                      name="Conversion Rate"
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer) => (
                    <div key={performer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
                        >
                          {performer.id}
                        </span>
                        <span>{performer.name}</span>
                      </div>
                      <div className="text-sm font-medium">
                        <span 
                          className={`px-3 py-1 rounded-full ${
                            performer.score >= 80 ? "bg-green-100 text-green-800" : 
                            performer.score >= 70 ? "bg-yellow-100 text-yellow-800" : 
                            "bg-red-100 text-red-800"
                          }`}
                        >
                          {performer.score} <span className="text-xs font-normal">score</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KolAnalyticsCharts;
