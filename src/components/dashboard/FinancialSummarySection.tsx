
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDelta } from "@/components/ui/badge-delta";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  BarChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { DollarSign, BarChart3, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { MonthlyRevenue, ExpenseBreakdown, TrendDirection } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';

interface FinancialSummaryProps {
  totalRevenue: number;
  totalExpenses: number;
  netCashflow: number;
  profitMargin: number;
  revenueChange: number;
  expenseChange: number;
  cashflowChange: number;
  profitChange: number;
  monthlyRevenue: MonthlyRevenue[];
  expenseBreakdown: ExpenseBreakdown[];
  loading?: boolean;
}

interface MonthlyRevenueTrendCardProps {
  data: MonthlyRevenue[];
  year: number;
}

interface ExpenseBreakdownCardProps {
  data: ExpenseBreakdown[];
}

const MonthlyRevenueTrendCard: React.FC<MonthlyRevenueTrendCardProps> = ({ data, year }) => {
  if (!data || data.length === 0) {
    return <p>No revenue data available</p>;
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Monthly Revenue Trend</CardTitle>
        <CardDescription>Financial performance for {year}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] p-4">
          <ChartContainer config={{
            revenue: { theme: { light: '#2563eb', dark: '#3b82f6' } },
            expenses: { theme: { light: '#ef4444', dark: '#f87171' } }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="var(--color-expenses)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const ExpenseBreakdownCard: React.FC<ExpenseBreakdownCardProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>By category</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] p-4">
          <ChartContainer config={{
            value: { theme: { light: '#2563eb', dark: '#3b82f6' } }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar
                  dataKey="amount"
                  name="Amount"
                  fill="var(--color-value)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const FinancialSummarySection: React.FC<FinancialSummaryProps> = ({
  totalRevenue,
  totalExpenses,
  netCashflow,
  profitMargin,
  revenueChange,
  expenseChange,
  cashflowChange,
  profitChange,
  monthlyRevenue,
  expenseBreakdown,
  loading = false,
}) => {
  // Determine trend direction based on change percentage
  const getTrendDirection = (change: number): TrendDirection => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="flex items-center space-x-1">
              <BadgeDelta deltaType={getTrendDirection(revenueChange)}>
                {Math.abs(revenueChange)}%
              </BadgeDelta>
              <p className="text-xs text-muted-foreground">from previous period</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Expenses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <div className="flex items-center space-x-1">
              <BadgeDelta deltaType={getTrendDirection(-expenseChange)}>
                {Math.abs(expenseChange)}%
              </BadgeDelta>
              <p className="text-xs text-muted-foreground">from previous period</p>
            </div>
          </CardContent>
        </Card>

        {/* Net Cashflow Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
            {cashflowChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netCashflow)}</div>
            <div className="flex items-center space-x-1">
              <BadgeDelta deltaType={getTrendDirection(cashflowChange)}>
                {Math.abs(cashflowChange)}%
              </BadgeDelta>
              <p className="text-xs text-muted-foreground">from previous period</p>
            </div>
          </CardContent>
        </Card>

        {/* Profit Margin Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
            <div className="flex items-center space-x-1">
              <BadgeDelta deltaType={getTrendDirection(profitChange)}>
                {Math.abs(profitChange)}%
              </BadgeDelta>
              <p className="text-xs text-muted-foreground">from previous period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <MonthlyRevenueTrendCard 
              data={monthlyRevenue} 
              year={new Date().getFullYear()} 
            />
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-4 lg:grid-cols-2">
            <ExpenseBreakdownCard data={expenseBreakdown} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
