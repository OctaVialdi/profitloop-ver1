
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

const engagementRateData = [
  { name: 'Sarah Johnson', value: 310 },
  { name: 'Alex Chen', value: 280 },
  { name: 'Maria Rodriguez', value: 420 },
  { name: 'Emma Wilson', value: 360 }
];

// Mobile-friendly data with shorter names
const engagementRateDataMobile = [
  { name: 'Sarah', value: 310 },
  { name: 'Alex', value: 280 },
  { name: 'Maria', value: 420 },
  { name: 'Emma', value: 360 }
];

const engagementTimeData = [
  { name: 'Jan', value: 3 },
  { name: 'Feb', value: 2 },
  { name: 'Mar', value: 4 },
  { name: 'Apr', value: 5 },
  { name: 'May', value: 5.5 },
  { name: 'Jun', value: 4 },
  { name: 'Jul', value: 2 },
  { name: 'Aug', value: 4 },
  { name: 'Sep', value: 5 }
];

const categoryData = [
  { name: 'Beauty', value: 1 },
  { name: 'Tech', value: 1 },
  { name: 'Fitness', value: 1 },
  { name: 'Fashion', value: 1 },
  { name: 'Food', value: 1 }
];

export const EngagementAnalysisTab = () => {
  const chartConfig = {
    value: {
      label: "Engagement",
      theme: {
        light: "#9b87f5",
        dark: "#7E69AB"
      }
    }
  };
  
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
      <Card className="lg:col-span-5 bg-white rounded-lg border border-gray-100 shadow-sm">
        <CardContent className="pt-6 pb-6">
          <h3 className="text-base font-medium mb-6 text-gray-800">Engagement Rate Distribution</h3>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={isMobile ? engagementRateDataMobile : engagementRateData} 
                margin={{ top: 5, right: 5, left: 0, bottom: 60 }}
              >
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-5 bg-white rounded-lg border border-gray-100 shadow-sm">
        <CardContent className="pt-6 pb-6">
          <h3 className="text-base font-medium mb-6 text-gray-800">Engagement Over Time</h3>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={engagementTimeData} 
                margin={{ top: 5, right: 5, left: 0, bottom: 20 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#7E69AB" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: "#7E69AB" }}
                  activeDot={{ r: 5, stroke: "#7E69AB", strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2 bg-white rounded-lg border border-gray-100 shadow-sm">
        <CardContent className="pt-6 pb-6">
          <h3 className="text-base font-medium mb-6 text-gray-800">Top Categories</h3>
          <div className="space-y-5 pb-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="font-medium text-sm min-w-[20px] text-right text-gray-700">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
