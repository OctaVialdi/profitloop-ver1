
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { RevenueContributor } from '@/types/dashboard';

interface TopRevenueContributorsCardProps {
  data: RevenueContributor[];
  title?: string;
}

export function TopRevenueContributorsCard({ data, title = "Top 5 Penyumbang Revenue Terbesar bulan ini" }: TopRevenueContributorsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Sort data by amount descending and take top 5
  const topContributors = [...data]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-background pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px]">
          <ChartContainer
            config={{
              value: { theme: { light: '#10b981', dark: '#34d399' } },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topContributors}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 30,
                  left: 70,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis 
                  type="number"
                  tickFormatter={(value) => formatCurrency(value).replace("Rp", "")}
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  width={60} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<ChartTooltipContent />} formatter={(value) => [formatCurrency(value as number), ""]} />
                <Bar dataKey="amount" name="Amount" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
