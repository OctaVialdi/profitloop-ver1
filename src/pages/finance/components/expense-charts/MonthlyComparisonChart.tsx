
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
      <Card>
        <CardHeader>
          <CardTitle>Monthly Comparison</CardTitle>
          <CardDescription>Expense vs Income (in millions Rp)</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p>Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Comparison</CardTitle>
        <CardDescription>Expense vs Income (in millions Rp)</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {monthlyComparisonData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyComparisonData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="expense" 
                name="Expense" 
                stroke="#ef4444" 
                strokeWidth={2} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                name="Income" 
                stroke="#3b82f6" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
