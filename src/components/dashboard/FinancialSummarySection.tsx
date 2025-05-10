
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
      revenue: index === 0 ? financialSummary.totalRevenue : 0,
      // Put all revenue in January for demo
      expenses: index === 0 ? financialSummary.totalExpenses : 0,
      // Put all expenses in January for demo
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(financialSummary.totalRevenue)}
          description="Current period"
          trend={{ value: "+8.2%", type: "up" }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Expenses"
          value={formatCurrency(financialSummary.totalExpenses)}
          description="Current period"
          trend={{ value: "+2.5%", type: "up" }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Net Cash Flow"
          value={formatCurrency(financialSummary.cashFlow)}
          description="Current period"
          trend={{ value: "+14.8%", type: "up" }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Return on Investment"
          value={`${financialSummary.roi.toFixed(1)}%`}
          description={`Target: ${financialSummary.roiTarget}%`}
          trend={{ 
            value: financialSummary.roi > financialSummary.roiTarget ? "Above target" : "Below target", 
            type: financialSummary.roi > financialSummary.roiTarget ? "up" : "down" 
          }}
          icon={financialSummary.roi > financialSummary.roiTarget ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TargetRevenueCard 
          currentRevenue={financialSummary.totalRevenue} 
          targetRevenue={targetRevenue}
          onUpdateTarget={handleUpdateTarget}
        />
        <TopRevenueContributorsCard data={revenueContributors} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <MonthlyRevenueTrendCard data={monthlyRevenueData} />
        <ExpensesTrendCard data={expenseBreakdowns} />
      </div>
    </div>
  );
}
