
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { ExpenseBreakdownItem } from "../types/expense";
import { ExpenseCategory } from "@/hooks/useExpenses";

interface ExpenseBreakdownChartProps {
  loading: boolean;
  expenseBreakdownData: ExpenseBreakdownItem[];
  categories: ExpenseCategory[];
}

export function ExpenseBreakdownChart({ 
  loading, 
  expenseBreakdownData,
  categories 
}: ExpenseBreakdownChartProps) {
  if (loading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Loading expense breakdown...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b p-4">
        <CardTitle className="text-lg">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[340px]">
        {expenseBreakdownData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No expense data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
