import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { FinancialSummary, YearlyTrend, RevenueContributor, ExpenseBreakdown, MonthlyRevenue } from '@/types/dashboard';
import { TargetRevenueCard } from './TargetRevenueCard';
import { MonthlyRevenueTrendCard } from './MonthlyRevenueTrendCard';
import { TopRevenueContributorsCard } from './TopRevenueContributorsCard';
import { ExpensesTrendCard } from './ExpensesTrendCard';
import { toast } from '@/components/ui/sonner';

interface FinancialSummarySectionProps {
  financialSummary: FinancialSummary;
  yearlyTrends: YearlyTrend[];
  revenueContributors: RevenueContributor[];
  expenseBreakdowns: ExpenseBreakdown[];
  onUpdateTargetRevenue?: (newTarget: number) => Promise<void>;
}

export function FinancialSummarySection({
  financialSummary,
  yearlyTrends,
  revenueContributors,
  expenseBreakdowns,
  onUpdateTargetRevenue
}: FinancialSummarySectionProps) {
  const [targetRevenue, setTargetRevenue] = useState(financialSummary.targetRevenue || 21500000);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Generate monthly data for the current year
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  
  // Generate sample monthly data (in a real app, this would come from the backend)
  const monthlyRevenueData: MonthlyRevenue[] = monthNames.map((month, index) => {
    // Use the latest year data as a base for distribution
    const latestYear = yearlyTrends[yearlyTrends.length - 1];
    // Distribute annual revenue and expenses across months with some variation
    const monthFactor = 0.5 + Math.random();
    return {
      month,
      revenue: index === 0 ? financialSummary.totalRevenue : 0, // Put all revenue in January for demo
      expenses: index === 0 ? financialSummary.totalExpenses : 0, // Put all expenses in January for demo
      target: index === 0 ? targetRevenue / 12 : 0 // Monthly target (yearly target / 12)
    };
  });
  
  const handleUpdateTarget = async (newTarget: number) => {
    try {
      setTargetRevenue(newTarget);
      
      if (onUpdateTargetRevenue) {
        await onUpdateTargetRevenue(newTarget);
        toast.success("Target revenue updated successfully");
      }
    } catch (error) {
      console.error('Error updating target revenue:', error);
      toast.error("Failed to update target revenue");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Financial BSC</h2>
      
      {/* Target Revenue Card */}
      <TargetRevenueCard 
        currentRevenue={financialSummary.totalRevenue} 
        targetRevenue={targetRevenue}
        onUpdateTarget={handleUpdateTarget} 
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="ROI"
          value={`${financialSummary.roi.toFixed(2)}%`}
          description={`Target: ${financialSummary.roiTarget}%`}
          change={financialSummary.roi - financialSummary.roiTarget}
          trend={financialSummary.roi >= financialSummary.roiTarget ? 'up' : 'down'}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Revenue"
          value={formatCurrency(financialSummary.totalRevenue)}
          trend="up"
          change={12.5}
          description="vs last month"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Expenses"
          value={formatCurrency(financialSummary.totalExpenses)}
          trend="down"
          change={-3.2}
          description="vs last month"
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <MetricCard
          title="Cash Flow"
          value={formatCurrency(financialSummary.cashFlow)}
          trend={financialSummary.cashFlow > 0 ? 'up' : 'down'}
          description="Net Balance"
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Monthly Revenue Trend Card */}
      <div className="grid gap-4 md:grid-cols-2">
        <MonthlyRevenueTrendCard data={monthlyRevenueData} year={currentYear} />
        <ExpensesTrendCard data={monthlyRevenueData} year={currentYear} />
      </div>
      
      {/* Top Revenue Contributors and Expense Trends */}
      <div className="grid gap-4 md:grid-cols-2">
        <TopRevenueContributorsCard data={revenueContributors} />
        
        <div className="space-y-4">
          {/* Debt Management Section - Kept from original */}
          <Card className="h-[200px]">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm">Debt Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Total Active Debt</span>
                  <span className="font-medium">{formatCurrency(financialSummary.debtTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Debt-to-Asset Ratio</span>
                  <span className="font-medium">{financialSummary.debtToAssetRatio.toFixed(2)}%</span>
                </div>
                <div className="mt-2">
                  <h4 className="text-xs font-medium mb-1">Upcoming Payments (30 days)</h4>
                  <div className="space-y-1 max-h-[70px] overflow-y-auto">
                    {financialSummary.upcomingDebtPayments.length > 0 ? (
                      financialSummary.upcomingDebtPayments.map(payment => (
                        <div key={payment.id} className="flex items-center justify-between text-xs">
                          <span className={payment.isPriority ? 'text-red-500' : ''}>
                            {payment.description}
                          </span>
                          <div className="flex items-center gap-2">
                            <span>{formatCurrency(payment.amount)}</span>
                            <span className="text-muted-foreground">
                              ({payment.daysRemaining}d)
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No upcoming payments</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Revenue vs. Expenses Trend - Kept from original */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs. Expenses (5 Year Trend)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                config={{
                  revenue: { theme: { light: '#2563eb', dark: '#3b82f6' } },
                  expenses: { theme: { light: '#ef4444', dark: '#f87171' } }
                }} 
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={yearlyTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
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
              {/* Event Annotations */}
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Key Events</h4>
                <div className="space-y-1">
                  {yearlyTrends
                    .filter(trend => trend.events && trend.events.length > 0)
                    .map(trend => 
                      trend.events?.map(event => (
                        <div key={`${trend.year}-${event.name}`} className="text-xs flex items-center gap-2">
                          <span className="font-medium">{trend.year}:</span>
                          <span>{event.name}</span>
                        </div>
                      ))
                    )
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Expenses Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fixed">
            <TabsList className="mb-4">
              <TabsTrigger value="fixed">Fixed</TabsTrigger>
              <TabsTrigger value="variable">Variable</TabsTrigger>
              <TabsTrigger value="operating">Operating</TabsTrigger>
            </TabsList>
            
            {expenseBreakdowns.map(expense => (
              <TabsContent key={expense.category} value={expense.category.split(' ')[0].toLowerCase()}>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{expense.category}</span>
                    <div className="text-sm">
                      <span className="font-medium">{formatCurrency(expense.amount)}</span>
                      <span className="text-muted-foreground ml-2">
                        ({expense.percentage}% of total)
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Expected</span>
                      <span>{formatCurrency(expense.expected)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Actual</span>
                      <span>{formatCurrency(expense.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Difference</span>
                      <span className={expense.amount > expense.expected ? 'text-red-500' : 'text-green-500'}>
                        {expense.amount > expense.expected ? '+' : ''}
                        {formatCurrency(expense.amount - expense.expected)}
                      </span>
                    </div>
                  </div>
                  
                  <ChartContainer config={{
                    value: { theme: { light: '#2563eb', dark: '#3b82f6' } }
                  }} className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Expected', value: expense.expected },
                          { name: 'Actual', value: expense.amount }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="value"
                          fill="var(--color-value)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
