
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/hooks/useOrganization';
import { 
  BSCDashboardData, 
  CompanyGoal, 
  FinancialSummary,
  OperationalMetric,
  CustomerMetric,
  InnovationMetric,
  RevenueContributor,
  YearlyTrend,
  ExpenseBreakdown,
  DepartmentData
} from '@/types/dashboard';

// Helper function to format date for Supabase query
function formatDateForQuery(date: Date | null | undefined): string | null {
  if (!date) return null;
  return date.toISOString();
}

async function fetchFinancialSummary(startDate?: Date, endDate?: Date): Promise<FinancialSummary> {
  // Build financial data query with date filter
  let financialQuery = supabase
    .from('financial_summary')
    .select('*')
    .order('month', { ascending: false });
  
  // Apply date filters if provided
  if (startDate) {
    financialQuery = financialQuery.gte('month', formatDateForQuery(startDate));
  }
  if (endDate) {
    financialQuery = financialQuery.lte('month', formatDateForQuery(endDate));
  }
  
  const { data: financialData, error: financialError } = await financialQuery.limit(1);

  if (financialError) throw new Error(financialError.message);
  
  // Build debt query with date filter
  let debtQuery = supabase
    .from('transactions')
    .select('*')
    .eq('type', 'debt_payment');
  
  // Apply date filters to transactions
  if (startDate) {
    debtQuery = debtQuery.gte('transaction_date', formatDateForQuery(startDate));
  }
  if (endDate) {
    debtQuery = debtQuery.lte('transaction_date', formatDateForQuery(endDate));
  }
  
  debtQuery = debtQuery.order('transaction_date', { ascending: true });
  const { data: debtData, error: debtError } = await debtQuery;

  if (debtError) throw new Error(debtError.message);
  
  // Calculate the actual values
  const totalRevenue = financialData?.[0]?.total_revenue || 0;
  const totalExpenses = financialData?.[0]?.total_expenses || 0;
  const cashFlow = totalRevenue - totalExpenses;
  
  // Get target revenue if available
  const targetRevenue = financialData?.[0]?.target_revenue || 0;
  
  // Calculate ROI
  const roi = totalExpenses > 0 
    ? ((totalRevenue - totalExpenses) / totalExpenses) * 100 
    : 0;
  
  // For demo purposes, we'll set a target ROI
  const roiTarget = 25; // 25%
  
  // Calculate debt metrics
  const debtTotal = debtData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  // Assuming assets are worth 5x monthly revenue for demonstration
  const assetValue = totalRevenue * 5;
  const debtToAssetRatio = assetValue > 0 ? (debtTotal / assetValue) * 100 : 0;
  
  // Find upcoming debt payments
  const today = new Date();
  const upcomingDebtPayments = debtData
    ?.filter(debt => {
      const dueDate = new Date(debt.transaction_date);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 30; // Next 30 days
    })
    .map(debt => {
      const dueDate = new Date(debt.transaction_date);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        id: debt.id,
        description: debt.description || 'Debt Payment',
        amount: debt.amount,
        dueDate: debt.transaction_date,
        daysRemaining: diffDays,
        isPriority: diffDays <= 7 // Priority if due in 7 days
      };
    }) || [];
  
  return {
    totalRevenue,
    totalExpenses,
    cashFlow,
    roi,
    roiTarget,
    debtTotal,
    debtToAssetRatio,
    targetRevenue,
    upcomingDebtPayments
  };
}

async function fetchCompanyGoals(startDate?: Date, endDate?: Date): Promise<CompanyGoal[]> {
  let query = supabase
    .from('company_goals')
    .select('*');
  
  // Apply date filters for company goals based on creation date or deadline
  if (startDate) {
    query = query.or(`created_at.gte.${formatDateForQuery(startDate)},deadline.gte.${formatDateForQuery(startDate)}`);
  }
  if (endDate) {
    query = query.or(`created_at.lte.${formatDateForQuery(endDate)},deadline.lte.${formatDateForQuery(endDate)}`);
  }
  
  query = query.order('deadline', { ascending: true });
  
  const { data, error } = await query;

  if (error) throw new Error(error.message);
  
  return data.map(goal => ({
    id: goal.id,
    name: goal.name,
    targetAmount: goal.target_amount,
    currentProgress: goal.current_progress,
    deadline: goal.deadline,
    isCritical: goal.is_critical,
    status: goal.status as "active" | "completed" | "cancelled", // Explicit cast to satisfy the type
    icon: goal.icon,
    description: goal.description
  }));
}

async function fetchOperationalMetrics(startDate?: Date, endDate?: Date): Promise<OperationalMetric[]> {
  let query = supabase
    .from('operational_metrics')
    .select('*');
  
  // Apply date filters for operational metrics
  if (startDate) {
    query = query.gte('created_at', formatDateForQuery(startDate));
  }
  if (endDate) {
    query = query.lte('created_at', formatDateForQuery(endDate));
  }
  
  query = query.order('created_at', { ascending: false }).limit(10);
  
  const { data, error } = await query;

  if (error) throw new Error(error.message);
  
  return data.map(metric => ({
    id: metric.id,
    type: metric.metric_type as "productivity" | "quality" | "inventory", // Explicit cast
    name: metric.metric_name,
    value: metric.metric_value,
    targetValue: metric.target_value,
    unit: metric.unit,
    departmentId: metric.department_id
  }));
}

async function fetchCustomerMetrics(startDate?: Date, endDate?: Date): Promise<CustomerMetric[]> {
  let query = supabase
    .from('customer_metrics')
    .select('*');
  
  // Apply date filters for customer metrics
  if (startDate) {
    query = query.gte('created_at', formatDateForQuery(startDate));
  }
  if (endDate) {
    query = query.lte('created_at', formatDateForQuery(endDate));
  }
  
  query = query.order('created_at', { ascending: false }).limit(10);
  
  const { data, error } = await query;

  if (error) throw new Error(error.message);
  
  return data.map(metric => ({
    id: metric.id,
    type: metric.metric_type as "satisfaction" | "retention" | "feedback", // Explicit cast
    name: metric.metric_name,
    value: metric.metric_value,
    category: metric.category,
    feedbackText: metric.feedback_text
  }));
}

async function fetchInnovationMetrics(startDate?: Date, endDate?: Date): Promise<InnovationMetric[]> {
  let query = supabase
    .from('innovation_metrics')
    .select('*');
  
  // Apply date filters for innovation metrics
  if (startDate) {
    query = query.gte('created_at', formatDateForQuery(startDate));
  }
  if (endDate) {
    query = query.lte('created_at', formatDateForQuery(endDate));
  }
  
  query = query.order('created_at', { ascending: false }).limit(10);
  
  const { data, error } = await query;

  if (error) throw new Error(error.message);
  
  return data.map(metric => ({
    id: metric.id,
    type: metric.metric_type as "training" | "innovation" | "technology", // Explicit cast
    name: metric.metric_name,
    value: metric.metric_value,
    details: metric.details
  }));
}

// Generate mock data for demo purposes
function generateMockRevenueContributors(startDate?: Date, endDate?: Date): RevenueContributor[] {
  // In a real implementation, we would filter this data based on the date range
  return [
    { name: 'Product Sales', amount: 245000, percentage: 45 },
    { name: 'Services', amount: 150000, percentage: 28 },
    { name: 'Subscriptions', amount: 75000, percentage: 14 },
    { name: 'Consulting', amount: 48000, percentage: 9 },
    { name: 'Other', amount: 22000, percentage: 4 }
  ];
}

function generateMockYearlyTrends(startDate?: Date, endDate?: Date): YearlyTrend[] {
  // This could be filtered based on the date range in a real implementation
  return [
    { 
      year: '2020', 
      revenue: 450000, 
      expenses: 380000,
      events: [{ name: 'COVID Impact', date: '2020-03-15', description: 'Business slowdown due to pandemic' }]
    },
    { 
      year: '2021', 
      revenue: 520000, 
      expenses: 420000,
      events: [{ name: 'Digital Shift', date: '2021-06-01', description: 'Invested in online platform' }]
    },
    { 
      year: '2022', 
      revenue: 610000, 
      expenses: 490000 
    },
    { 
      year: '2023', 
      revenue: 720000, 
      expenses: 550000,
      events: [{ name: 'Expansion Q3', date: '2023-07-15', description: 'New branch opened' }]
    },
    { 
      year: '2024', 
      revenue: 840000, 
      expenses: 640000 
    }
  ];
}

function generateMockExpenseBreakdown(startDate?: Date, endDate?: Date): ExpenseBreakdown[] {
  // This could be filtered based on the date range in a real implementation
  return [
    { category: 'Fixed Expenses', amount: 250000, expected: 245000, percentage: 39 },
    { category: 'Variable Expenses', amount: 180000, expected: 190000, percentage: 28 },
    { category: 'Operating Expenses', amount: 210000, expected: 205000, percentage: 33 }
  ];
}

function generateMockDepartments(): DepartmentData[] {
  return [
    { id: '1', name: 'Sales' },
    { id: '2', name: 'Marketing' },
    { id: '3', name: 'Operations' },
    { id: '4', name: 'Finance' },
    { id: '5', name: 'HR' },
    { id: '6', name: 'IT' }
  ];
}

// Main function to fetch all dashboard data
async function fetchDashboardData(startDate?: Date, endDate?: Date): Promise<BSCDashboardData> {
  try {
    const [
      financialSummary,
      companyGoals,
      operationalMetrics,
      customerMetrics,
      innovationMetrics
    ] = await Promise.all([
      fetchFinancialSummary(startDate, endDate),
      fetchCompanyGoals(startDate, endDate),
      fetchOperationalMetrics(startDate, endDate),
      fetchCustomerMetrics(startDate, endDate),
      fetchInnovationMetrics(startDate, endDate)
    ]);
    
    // For now, we'll generate some mock data for demonstration
    const revenueContributors = generateMockRevenueContributors(startDate, endDate);
    const yearlyTrends = generateMockYearlyTrends(startDate, endDate);
    const expenseBreakdowns = generateMockExpenseBreakdown(startDate, endDate);
    const departments = generateMockDepartments();
    
    return {
      financialSummary,
      companyGoals,
      operationalMetrics,
      customerMetrics,
      innovationMetrics,
      revenueContributors,
      yearlyTrends,
      expenseBreakdowns,
      departments
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export function useDashboardData(startDate?: Date, endDate?: Date) {
  const { organization } = useOrganization();
  
  return useQuery({
    queryKey: ['dashboardData', organization?.id, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => fetchDashboardData(startDate, endDate),
    enabled: !!organization?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
}
