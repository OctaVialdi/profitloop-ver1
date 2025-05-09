
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
        // Create new record - using explicit types to match the database schema
        const currentDate = new Date().toISOString();
        const { error } = await supabase
          .from('financial_summary')
          .insert({
            organization_id: organization.id,
            target_revenue: newTarget,
            month: currentDate,
            total_revenue: dashboardData?.financialSummary.totalRevenue || 0,
            total_expenses: dashboardData?.financialSummary.totalExpenses || 0
          });
        
        if (error) throw error;
      }
      
      refetch(); // Refresh dashboard data
    } catch (error: any) {
      console.error("Error updating target revenue:", error);
      throw error; // Re-throw to be handled by the caller
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  if (error || !dashboardData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load dashboard data.</p>
            <p className="text-gray-500 mb-4">{error instanceof Error ? error.message : "Unknown error occurred"}</p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {getGreeting()}, {userProfile?.full_name || 'User'}!
          </h1>
          {goalsNearDeadline > 0 && (
            <p className="text-amber-600 mt-1">
              You have {goalsNearDeadline} goal{goalsNearDeadline > 1 ? 's' : ''} approaching deadline soon.
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <DashboardFilter onRangeChange={handleDateRangeChange} initialRange={dateRange} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExportDashboard}>
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
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="goals">Company Goals</TabsTrigger>
          <TabsTrigger value="operations">Operational</TabsTrigger>
          <TabsTrigger value="customer">Customer & Innovation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="space-y-4">
          <FinancialSummarySection
            financialSummary={dashboardData.financialSummary}
            yearlyTrends={dashboardData.yearlyTrends}
            revenueContributors={dashboardData.revenueContributors}
            expenseBreakdowns={dashboardData.expenseBreakdowns}
            onUpdateTargetRevenue={handleUpdateTargetRevenue}
          />
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4">
          <CompanyGoalsSection
            goals={dashboardData.companyGoals}
            onAddGoal={handleAddGoal}
          />
        </TabsContent>
        
        <TabsContent value="operations" className="space-y-4">
          <OperationalMetricsSection
            metrics={dashboardData.operationalMetrics}
            departments={dashboardData.departments}
          />
        </TabsContent>
        
        <TabsContent value="customer" className="space-y-4">
          <CustomerInnovationSection
            customerMetrics={dashboardData.customerMetrics}
            innovationMetrics={dashboardData.innovationMetrics}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
