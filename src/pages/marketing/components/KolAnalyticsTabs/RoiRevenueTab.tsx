
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";

const roiByKolData = [
  { name: 'Sarah Johnson', value: 76 },
  { name: 'Alex Chen', value: 72 },
  { name: 'Maria Rodriguez', value: 85 },
  { name: 'Emma Wilson', value: 79 }
];

const roiTrendsData = [
  { name: 'Jan', value: 48 },
  { name: 'Feb', value: 32 },
  { name: 'Mar', value: 20 },
  { name: 'Apr', value: 35 },
  { name: 'May', value: 50 },
  { name: 'Jun', value: 30 },
  { name: 'Jul', value: 29 },
  { name: 'Aug', value: 20 },
  { name: 'Sep', value: 48 }
];

export const RoiRevenueTab = () => {
  const chartConfig = {
    value: {
      label: "ROI",
      theme: {
        light: "#FF7E33",
        dark: "#F36A22"
      }
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">ROI by KOL</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiByKolData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="value" fill="#FF7E33" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">ROI Trends</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FF7E33" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: "#FF7E33" }}
                  activeDot={{ r: 5, stroke: "#FF7E33", strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
