
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";

const conversionRateData = [
  { name: 'Sarah Johnson', value: 310 },
  { name: 'Alex Chen', value: 280 },
  { name: 'Maria Rodriguez', value: 450 },
  { name: 'Emma Wilson', value: 370 }
];

const conversionTrendsData = [
  { name: 'Jan', value: 9 },
  { name: 'Feb', value: 2 },
  { name: 'Mar', value: 5 },
  { name: 'Apr', value: 7 },
  { name: 'May', value: 8 },
  { name: 'Jun', value: 5 },
  { name: 'Jul', value: 8 },
  { name: 'Aug', value: 3 },
  { name: 'Sep', value: 9 }
];

const topPerformersData = [
  { rank: 1, name: 'Sarah Johnson', score: 78 },
  { rank: 2, name: 'Alex Chen', score: 72 },
  { rank: 3, name: 'Maria Rodriguez', score: 86 },
  { rank: 4, name: 'David Kim', score: 65 },
  { rank: 5, name: 'Emma Wilson', score: 81 }
];

export const ConversionMetricsTab = () => {
  const chartConfig = {
    value: {
      label: "Conversions",
      theme: {
        light: "#33B0E0",
        dark: "#2798C5"
      }
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 md:col-span-1">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Conversion Rate by KOL</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionRateData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="value" fill="#33B0E0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-1">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Conversion Trends</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#33B0E0" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: "#33B0E0" }}
                  activeDot={{ r: 5, stroke: "#33B0E0", strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-1">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Top Performers</h3>
          <div className="space-y-4">
            {topPerformersData.map((performer) => (
              <div key={performer.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    {performer.rank}
                  </div>
                  <span className="font-medium">{performer.name}</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-bold text-gray-900">{performer.score}</span> score
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
