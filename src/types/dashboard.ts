
export interface FinancialMetric {
  id: string;
  name: string;
  value: number;
  target?: number;
  unit: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'debt_payment';
  amount: number;
  description?: string;
  department_id?: string;
  category?: string;
  transaction_date: string;
  created_at: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  cashFlow: number;
  roi: number;
  roiTarget: number;
  debtTotal: number;
  debtToAssetRatio: number;
  upcomingDebtPayments: DebtPayment[];
}

export interface DebtPayment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  isPriority: boolean;
}

export interface CompanyGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentProgress: number;
  deadline: string;
  isCritical: boolean;
  status: 'active' | 'completed' | 'cancelled';
  icon?: string;
  description?: string;
}

export interface OperationalMetric {
  id: string;
  type: 'productivity' | 'quality' | 'inventory';
  name: string;
  value: number;
  targetValue?: number;
  unit?: string;
  departmentId?: string;
}

export interface CustomerMetric {
  id: string;
  type: 'satisfaction' | 'retention' | 'feedback';
  name: string;
  value: number;
  category?: string;
  feedbackText?: string;
}

export interface InnovationMetric {
  id: string;
  type: 'training' | 'innovation' | 'technology';
  name: string;
  value: number;
  details?: string;
}

export interface RevenueContributor {
  name: string;
  amount: number;
  percentage: number;
}

export interface YearlyTrend {
  year: string;
  revenue: number;
  expenses: number;
  events?: Array<{
    name: string;
    date: string;
    description?: string;
  }>;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  expected: number;
  percentage: number;
}

export interface DepartmentData {
  id: string;
  name: string;
}

export interface BSCDashboardData {
  financialSummary: FinancialSummary;
  companyGoals: CompanyGoal[];
  operationalMetrics: OperationalMetric[];
  customerMetrics: CustomerMetric[];
  innovationMetrics: InnovationMetric[];
  revenueContributors: RevenueContributor[];
  yearlyTrends: YearlyTrend[];
  expenseBreakdowns: ExpenseBreakdown[];
  departments: DepartmentData[];
}
