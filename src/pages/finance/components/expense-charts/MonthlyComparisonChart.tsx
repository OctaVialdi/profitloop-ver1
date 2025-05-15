
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatRupiah } from "@/utils/formatUtils";

interface MonthlyComparisonChartProps {
  monthlyComparisonData: Array<{
    name: string;
    expense: number;
    income: number;
  }>;
  loading?: boolean;
}

export function MonthlyComparisonChart({ monthlyComparisonData, loading = false }: MonthlyComparisonChartProps) {
  const formatTooltipValue = (value: number) => {
    // Assuming the value is in millions, convert back to full amount for tooltip
    return formatRupiah(value * 1000000);
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly Comparison</CardTitle>
          <CardDescription className="text-xs">Expense vs Income (in millions Rp)</CardDescription>
        </CardHeader>
        <CardContent className="h-[230px] flex items-center justify-center">
          <p>Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Monthly Comparison</CardTitle>
        <CardDescription className="text-xs">Expense vs Income (in millions Rp)</CardDescription>
      </CardHeader>
      <CardContent className="h-[230px] pb-1">
        {monthlyComparisonData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={monthlyComparisonData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={formatTooltipValue} />
              <Legend wrapperStyle={{ fontSize: '10px', marginTop: '-15px' }} />
              <Line 
                type="monotone" 
                dataKey="expense" 
                name="Expense" 
                stroke="#ef4444" 
                strokeWidth={2} 
                activeDot={{ r: 5 }} 
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                name="Income" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
