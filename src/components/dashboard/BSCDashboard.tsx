
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useOrganization } from '@/hooks/useOrganization';
import { DateRangeType, CompanyGoal } from '@/types/dashboard';
import { useDateRangeFilter } from '@/hooks/useDateRangeFilter';
import { DashboardFilter } from './DashboardFilter';

// Import dashboard sections
import { FinancialSummarySection } from './FinancialSummarySection';
import { CompanyGoalsSection } from './CompanyGoalsSection';
import { OperationalMetricsSection } from './OperationalMetricsSection';
import { CustomerInnovationSection } from './CustomerInnovationSection';
import { AIRecommendationCard } from './AIRecommendationCard';
import { toast } from '@/components/ui/sonner';

export function BSCDashboard() {
  const { dateRange, updateDateRange } = useDateRangeFilter();
  const { data: dashboardData, isLoading, error, refetch } = useDashboardData(dateRange.from, dateRange.to);
  const { organization, userProfile } = useOrganization();
  const [activeTab, setActiveTab] = useState('financial');
  
  // AI Recommendations (simulated)
  const aiRecommendations = [
    "Based on current cash flow trends, allocate 15% more budget to marketing to capitalize on growth opportunities.",
    "Your inventory turnover is below industry average. Consider reducing stock levels of slow-moving items.",
    "Employee training hours are 20% below target. Investing in training could improve productivity metrics.",
    "Customer feedback shows pricing concerns. Consider a customer loyalty program to improve retention."
  ];
  
  // Get time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Count goals near deadline
  const goalsNearDeadline = dashboardData?.companyGoals.filter(goal => {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7; // Within next 7 days
  }).length || 0;
  
  // Handle adding a new goal
  const handleAddGoal = async (goal: Partial<CompanyGoal>) => {
    try {
      if (!organization?.id) {
        toast.error("Organization data not available.");
        return;
      }
      
      const { error } = await supabase.from('company_goals').insert({
        organization_id: organization.id,
        name: goal.name,
        target_amount: goal.targetAmount,
        current_progress: goal.currentProgress || 0,
        deadline: goal.deadline,
        is_critical: goal.isCritical || false,
        icon: goal.icon,
        created_by: userProfile?.id,
        status: 'active'
      });
      
      if (error) throw error;
      
      toast.success("Goal added successfully!");
      refetch(); // Refresh dashboard data
    } catch (error: any) {
      console.error("Error adding goal:", error);
      toast.error(`Failed to add goal: ${error.message}`);
    }
  };
  
  // Handle updating target revenue
  const handleUpdateTargetRevenue = async (newTarget: number) => {
    try {
      if (!organization?.id) {
        toast.error("Organization data not available.");
        return;
      }
      
      // Check if there's an existing financial_summary record
      const { data: existingRecord, error: fetchError } = await supabase
        .from('financial_summary')
        .select('*')
        .eq('organization_id', organization.id)
        .limit(1);
      
      if (fetchError) throw fetchError;
      
      if (existingRecord && existingRecord.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('financial_summary')
          .update({ target_revenue: newTarget })
          .eq('id', existingRecord[0].id);
        
        if (error) throw error;
      } else {
        // Create new record
        const currentDate = new Date().toISOString();
        const newRecord = {
          organization_id: organization.id,
          target_revenue: newTarget,
          month: currentDate,
          total_revenue: dashboardData?.financialSummary.totalRevenue || 0,
          total_expenses: dashboardData?.financialSummary.totalExpenses || 0,
          net_cashflow: (dashboardData?.financialSummary.totalRevenue || 0) - 
                        (dashboardData?.financialSummary.totalExpenses || 0)
        };
        
        const { error } = await supabase
          .from('financial_summary')
          .insert(newRecord);
        
        if (error) throw error;
      }
      
      refetch(); // Refresh dashboard data
      toast.success("Target revenue updated successfully!");
    } catch (error: any) {
      console.error("Error updating target revenue:", error);
      toast.error(`Failed to update target revenue: ${error.message}`);
    }
  };
  
  // Handle exporting dashboard as PDF
  const handleExportDashboard = () => {
    toast.success("Dashboard report will be downloaded shortly.");
    // In a real implementation, this would generate and download a PDF
  };

  // Handle date range changes
  const handleDateRangeChange = (range: DateRangeType) => {
    updateDateRange(range);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 mt-8">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-6"></div>
          <p className="text-muted-foreground font-medium">Loading your dashboard data...</p>
        </div>
      </div>
    );
  }
  
  if (error || !dashboardData) {
    return (
      <Card className="border-destructive/20 mt-8">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <RefreshCw className="h-8 w-8" />
            </div>
            <p className="text-destructive text-lg font-medium mb-2">Failed to load dashboard data</p>
            <p className="text-muted-foreground mb-6">{error instanceof Error ? error.message : "Unknown error occurred"}</p>
            <Button onClick={() => refetch()} variant="outline" size="lg" className="font-medium">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8 py-4 px-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 p-6 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {getGreeting()}, {userProfile?.full_name || 'User'}!
          </h2>
          {goalsNearDeadline > 0 && (
            <p className="text-amber-600 dark:text-amber-500 mt-1 font-medium">
              You have {goalsNearDeadline} goal{goalsNearDeadline > 1 ? 's' : ''} approaching deadline soon.
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <DashboardFilter onRangeChange={handleDateRangeChange} initialRange={dateRange} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()} className="group">
              <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </Button>
            <Button onClick={handleExportDashboard} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>
      
      {/* AI Recommendation */}
      <AIRecommendationCard recommendations={aiRecommendations} />
      
      {/* Dashboard Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-muted/50 p-1 w-full md:w-auto border rounded-lg">
          <TabsTrigger 
            value="financial" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:shadow-sm"
          >
            Financial
          </TabsTrigger>
          <TabsTrigger 
            value="goals" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:shadow-sm"
          >
            Company Goals
          </TabsTrigger>
          <TabsTrigger 
            value="operations" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:shadow-sm"
          >
            Operational
          </TabsTrigger>
          <TabsTrigger 
            value="customer" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:shadow-sm"
          >
            Customer & Innovation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="space-y-6">
          <FinancialSummarySection
            financialSummary={dashboardData.financialSummary}
            yearlyTrends={dashboardData.yearlyTrends}
            revenueContributors={dashboardData.revenueContributors}
            expenseBreakdowns={dashboardData.expenseBreakdowns}
            onUpdateTargetRevenue={handleUpdateTargetRevenue}
          />
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-6">
          <CompanyGoalsSection
            goals={dashboardData.companyGoals}
            onAddGoal={handleAddGoal}
          />
        </TabsContent>
        
        <TabsContent value="operations" className="space-y-6">
          <OperationalMetricsSection
            metrics={dashboardData.operationalMetrics}
            departments={dashboardData.departments}
          />
        </TabsContent>
        
        <TabsContent value="customer" className="space-y-6">
          <CustomerInnovationSection
            customerMetrics={dashboardData.customerMetrics}
            innovationMetrics={dashboardData.innovationMetrics}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
