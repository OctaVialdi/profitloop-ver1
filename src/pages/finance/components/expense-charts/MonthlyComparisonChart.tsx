
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { formatRupiah } from "@/utils/formatUtils";

interface MonthlyComparisonChartProps {
  loading: boolean;
  monthlyComparisonData: any[];
}

export function MonthlyComparisonChart({ loading, monthlyComparisonData }: MonthlyComparisonChartProps) {
  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.fill }}>
              {entry.name}: {formatRupiah(entry.value * 1000000)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Monthly Comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-[260px] pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyComparisonData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barSize={20}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              fontSize={12} 
              tickLine={false} 
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              fontSize={12} 
              tickFormatter={(value) => `${value}M`}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280' }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '5px' }}
              iconSize={8}
              iconType="circle"
            />
            <Bar name="Department" dataKey="department" fill="#8884d8" radius={[2, 2, 0, 0]} />
            <Bar name="Expenses" dataKey="expense" fill="#82ca9d" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
