
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrganization } from '@/hooks/useOrganization';
import { 
  FinancialSummaryRecord, 
  MonthlyRevenue, 
  ExpenseBreakdown, 
  OperationalMetric,
  AIRecommendation
} from '@/types/dashboard';

export const useDashboardData = () => {
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<FinancialSummaryRecord[]>([]);
  const [operationalMetrics, setOperationalMetrics] = useState<OperationalMetric[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!organization?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch financial summary
      const { data: financialSummary, error: financialError } = await supabase
        .from('financial_summary')
        .select('*')
        .eq('organization_id', organization.id);
        
      if (financialError) throw financialError;
      setFinancialData(financialSummary || []);
      
      // Fetch operational metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('operational_metrics')
        .select('*')
        .eq('organization_id', organization.id);
        
      if (metricsError) throw metricsError;
      setOperationalMetrics(metrics || []);
      
      // Transform financial data for monthly revenue chart
      const monthlyData = financialSummary?.map(item => ({
        month: item.month,
        revenue: item.total_revenue,
        expenses: item.total_expenses,
        // Set target revenue if available, otherwise use actual revenue
        targetRevenue: item.target_revenue || item.total_revenue,
      })) || [];
      
      setMonthlyRevenue(monthlyData);
      
      // Mock data for expense breakdown - replace with actual DB fetch when available
      setExpenseBreakdown([
        { category: 'Operations', amount: 8400 },
        { category: 'Marketing', amount: 5200 },
        { category: 'Personnel', amount: 12800 },
        { category: 'Technology', amount: 4700 },
        { category: 'Office', amount: 3100 },
      ]);
      
      // Mock AI recommendations - replace with actual API call when implemented
      setRecommendations([
        {
          id: '1',
          title: 'Reduce operational expenses by 5%',
          description: 'Based on industry benchmarks, your operational costs are higher than similar organizations.',
          actionable: true,
          priority: 'high',
          category: 'cost-optimization'
        },
        {
          id: '2',
          title: 'Increase marketing efficiency',
          description: 'Your marketing ROI is below target. Consider reallocating budget to better performing channels.',
          actionable: true,
          priority: 'medium',
          category: 'marketing'
        },
        {
          id: '3',
          title: 'Review HR policy effectiveness',
          description: 'Employee retention metrics suggest reviewing your current HR policies may be beneficial.',
          actionable: true,
          priority: 'medium',
          category: 'human-resources'
        }
      ]);
      
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    if (organization?.id) {
      fetchDashboardData();
    }
  }, [organization?.id, fetchDashboardData]);

  return {
    loading,
    error,
    financialData,
    operationalMetrics,
    monthlyRevenue,
    expenseBreakdown,
    recommendations,
    refreshData: fetchDashboardData
  };
};
