
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlyComparisonItem } from "../types/expense";

interface MonthlyComparisonChartProps {
  monthlyComparisonData: MonthlyComparisonItem[];
}

export function MonthlyComparisonChart({ monthlyComparisonData }: MonthlyComparisonChartProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b p-4">
        <CardTitle className="text-lg">Monthly Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[340px]">
        {monthlyComparisonData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyComparisonData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('id-ID', {
                    notation: 'compact',
                    compactDisplay: 'short',
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value) => 
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(value as number)
                }
              />
              <Legend />
              <Bar dataKey="amount" name="Expenses" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No comparison data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
