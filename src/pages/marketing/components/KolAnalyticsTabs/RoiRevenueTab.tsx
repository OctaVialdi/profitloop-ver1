
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

const roiByKolData = [
  { name: 'Sarah Johnson', value: 76 },
  { name: 'Alex Chen', value: 72 },
  { name: 'Maria Rodriguez', value: 85 },
  { name: 'Emma Wilson', value: 79 }
];

// Mobile-friendly data with shorter names
const roiByKolDataMobile = [
  { name: 'Sarah', value: 76 },
  { name: 'Alex', value: 72 },
  { name: 'Maria', value: 85 },
  { name: 'Emma', value: 79 }
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
  
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">ROI by KOL</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={isMobile ? roiByKolDataMobile : roiByKolData} 
                margin={{ top: 10, right: 10, left: 0, bottom: isMobile ? 40 : 60 }}
              >
                <XAxis 
                  dataKey="name" 
                  angle={isMobile ? -30 : -45} 
                  textAnchor="end" 
                  height={60} 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
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
              <LineChart 
                data={roiTrendsData} 
                margin={{ top: 10, right: 10, left: 0, bottom: isMobile ? 15 : 20 }}
              >
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
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
