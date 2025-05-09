
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { MonthlyRevenue } from '@/types/dashboard';

interface ExpensesTrendCardProps {
  data: MonthlyRevenue[];
  year: number;
}

export function ExpensesTrendCard({ data, year }: ExpensesTrendCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-background pb-2">
        <CardTitle className="text-lg font-medium">Expenses Trend {year}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px]">
          <ChartContainer
            config={{
              expenses: { theme: { light: '#ef4444', dark: '#f87171' } },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  angle={-45} 
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                  height={60}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value).replace("Rp", "")}
                />
                <Tooltip content={<ChartTooltipContent />} formatter={(value) => [formatCurrency(value as number), ""]} />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--color-expenses)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
