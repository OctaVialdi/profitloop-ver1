
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonthlyRevenue } from '@/types/dashboard';

interface MonthlyRevenueTrendCardProps {
  data: MonthlyRevenue[];
  year: number;
}

export function MonthlyRevenueTrendCard({ data, year }: MonthlyRevenueTrendCardProps) {
  const [selectedMonths, setSelectedMonths] = useState<string>("all");
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Filter data based on selected months
  const filteredData = selectedMonths === "all" 
    ? data 
    : data.filter(item => {
        const monthIndex = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"].indexOf(item.month);
        if (selectedMonths === "q1") return monthIndex >= 0 && monthIndex <= 2;
        if (selectedMonths === "q2") return monthIndex >= 3 && monthIndex <= 5;
        if (selectedMonths === "q3") return monthIndex >= 6 && monthIndex <= 8;
        if (selectedMonths === "q4") return monthIndex >= 9 && monthIndex <= 11;
        return true;
      });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-background pb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle className="text-lg font-medium">Revenue Trend {year}</CardTitle>
          <Select value={selectedMonths} onValueChange={setSelectedMonths}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bulan</SelectItem>
              <SelectItem value="q1">Q1 (Jan-Mar)</SelectItem>
              <SelectItem value="q2">Q2 (Apr-Jun)</SelectItem>
              <SelectItem value="q3">Q3 (Jul-Sep)</SelectItem>
              <SelectItem value="q4">Q4 (Okt-Des)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px]">
          <ChartContainer
            config={{
              revenue: { theme: { light: '#2563eb', dark: '#3b82f6' } },
              expenses: { theme: { light: '#ef4444', dark: '#f87171' } },
              target: { theme: { light: '#16a34a', dark: '#4ade80' } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
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
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                {filteredData.some(item => item.target) && (
                  <Bar dataKey="target" name="Target" fill="var(--color-target)" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
