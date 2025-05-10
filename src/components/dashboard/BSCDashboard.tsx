
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Filter } from "lucide-react";
import { AIRecommendationCard } from "./AIRecommendationCard";
import { FinancialSummarySection } from "./FinancialSummarySection";
import { OperationalMetricsSection } from "./OperationalMetricsSection";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { FinancialSummaryRecord } from '@/types/dashboard';

export const BSCDashboard = () => {
  const { toast } = useToast();
  const { organization } = useOrganization();
  const { 
    loading, 
    financialData, 
    operationalMetrics, 
    monthlyRevenue, 
    expenseBreakdown, 
    recommendations,
    refreshData,
    error
  } = useDashboardData();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  
  // Sample financial metrics calculations
  const totalRevenue = financialData.length > 0 
    ? financialData.reduce((sum, item) => sum + item.total_revenue, 0) 
    : 0;
    
  const totalExpenses = financialData.length > 0 
    ? financialData.reduce((sum, item) => sum + item.total_expenses, 0) 
    : 0;
    
  const netCashflow = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netCashflow / totalRevenue) * 100 : 0;
  
  // Sample trend data (in a real app, these would be calculated from historical data)
  const revenueChange = 8.5;
  const expenseChange = 5.2;
  const cashflowChange = 12.3;
  const profitChange = 7.1;

  // Function to handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
    
    toast({
      title: "Dashboard Refreshed",
      description: "The latest data has been loaded.",
    });
  };
  
  // Function to seed sample data if needed (for demo purposes)
  const seedSampleData = async () => {
    if (!organization?.id) return;
    
    try {
      // Check if we already have data
      const { data: existingData, error: checkError } = await supabase
        .from('financial_summary')
        .select('id')
        .eq('organization_id', organization.id)
        .limit(1);
        
      if (checkError) throw checkError;
      
      // If we already have data, don't seed
      if (existingData && existingData.length > 0) {
        console.log("Financial data already exists, not seeding");
        return;
      }
      
      // Define sample financial data
      const sampleFinancialData: Omit<FinancialSummaryRecord, 'id'>[] = [
        {
          organization_id: organization.id,
          month: 'Jan',
          total_revenue: 42000,
          total_expenses: 31500,
          net_cashflow: 10500,
          target_revenue: 45000
        },
        {
          organization_id: organization.id,
          month: 'Feb',
          total_revenue: 38500,
          total_expenses: 30000,
          net_cashflow: 8500,
          target_revenue: 45000
        },
        {
          organization_id: organization.id,
          month: 'Mar',
          total_revenue: 45000,
          total_expenses: 33000,
          net_cashflow: 12000,
          target_revenue: 45000
        },
        {
          organization_id: organization.id,
          month: 'Apr',
          total_revenue: 51000,
          total_expenses: 35000,
          net_cashflow: 16000,
          target_revenue: 50000
        },
        {
          organization_id: organization.id,
          month: 'May',
          total_revenue: 49000,
          total_expenses: 36000,
          net_cashflow: 13000,
          target_revenue: 50000
        },
        {
          organization_id: organization.id,
          month: 'Jun',
          total_revenue: 54000,
          total_expenses: 38000,
          net_cashflow: 16000,
          target_revenue: 50000
        }
      ];
      
      // Use type assertion for the insert operation
      const { error: insertError } = await supabase
        .from('financial_summary')
        .insert(sampleFinancialData as any);
        
      if (insertError) throw insertError;
      
      console.log("Sample financial data seeded successfully");
      refreshData();
      
    } catch (err) {
      console.error("Error seeding sample data:", err);
    }
  };
  
  useEffect(() => {
    // Check if we need to seed data
    if (organization?.id && financialData.length === 0 && !loading) {
      seedSampleData();
    }
  }, [organization?.id, financialData.length, loading]);
  
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading dashboard data",
        description: error,
      });
    }
  }, [error, toast]);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Performance overview for your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Financial Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Overview of your key financial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialSummarySection
                totalRevenue={totalRevenue}
                totalExpenses={totalExpenses}
                netCashflow={netCashflow}
                profitMargin={profitMargin}
                revenueChange={revenueChange}
                expenseChange={expenseChange}
                cashflowChange={cashflowChange}
                profitChange={profitChange}
                monthlyRevenue={monthlyRevenue}
                expenseBreakdown={expenseBreakdown}
                loading={loading}
              />
            </CardContent>
          </Card>
          
          {/* AI Recommendations and Operational Highlights */}
          <div className="grid gap-6 md:grid-cols-2">
            <AIRecommendationCard recommendations={recommendations} />
            
            <Card>
              <CardHeader>
                <CardTitle>Operational Highlights</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {operationalMetrics.slice(0, 3).map((metric) => (
                  <div key={metric.id || metric.metric_name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{metric.metric_name}</p>
                      <p className="text-sm text-muted-foreground">{metric.period || 'Current period'}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{metric.metric_value}{metric.unit ? ` ${metric.unit}` : ''}</span>
                      {metric.target_value && (
                        <span className="text-xs text-muted-foreground ml-2">
                          / {metric.target_value}{metric.unit ? ` ${metric.unit}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                {operationalMetrics.length === 0 && !loading && (
                  <p className="text-sm text-muted-foreground">No operational metrics available</p>
                )}
                
                {loading && (
                  <div className="h-20 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading metrics...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
              <CardDescription>Detailed financial analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialSummarySection
                totalRevenue={totalRevenue}
                totalExpenses={totalExpenses}
                netCashflow={netCashflow}
                profitMargin={profitMargin}
                revenueChange={revenueChange}
                expenseChange={expenseChange}
                cashflowChange={cashflowChange}
                profitChange={profitChange}
                monthlyRevenue={monthlyRevenue}
                expenseBreakdown={expenseBreakdown}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Operational Metrics</CardTitle>
              <CardDescription>Performance indicators across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <OperationalMetricsSection metrics={operationalMetrics} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BSCDashboard;
