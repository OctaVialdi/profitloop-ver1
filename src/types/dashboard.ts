// Date Range Type
export type DateRangeType = {
  from: Date;
  to: Date;
};

// Financial Summary Types
export type FinancialSummary = {
  totalRevenue: number;
  totalExpenses: number;
  cashFlow: number;
  roi: number;
  roiTarget: number;
  debtTotal: number;
  debtToAssetRatio: number;
  targetRevenue?: number; // Added target revenue field
  upcomingDebtPayments: DebtPayment[];
};

export type DebtPayment = {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  isPriority: boolean;
};

// Company Goal Types
export type CompanyGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentProgress: number;
  deadline: string;
  isCritical: boolean;
  status: "active" | "completed" | "cancelled";
  icon?: string;
  description?: string;
};

// Operational Metric Types
export type OperationalMetric = {
  id: string;
  type: "productivity" | "quality" | "inventory";
  name: string;
  value: number;
  targetValue?: number;
  unit?: string;
  departmentId?: string;
};

// Customer Metric Types
export type CustomerMetric = {
  id: string;
  type: "satisfaction" | "retention" | "feedback";
  name: string;
  value: number;
  category?: string;
  feedbackText?: string;
};

// Innovation Metric Types
export type InnovationMetric = {
  id: string;
  type: "training" | "innovation" | "technology";
  name: string;
  value: number;
  details?: string;
};

// Revenue Contributor Type
export type RevenueContributor = {
  name: string;
  amount: number;
  percentage: number;
};

// Yearly Trend Type
export type YearlyTrend = {
  year: string;
  revenue: number;
  expenses: number;
  events?: YearlyEvent[];
};

export type YearlyEvent = {
  name: string;
  date: string;
  description?: string;
};

// Expense Breakdown Type
export type ExpenseBreakdown = {
  category: string;
  amount: number;
  expected: number;
  percentage: number;
};

// Department Data Type
export type DepartmentData = {
  id: string;
  name: string;
};

// BSC Dashboard Data Type
export type BSCDashboardData = {
  financialSummary: FinancialSummary;
  companyGoals: CompanyGoal[];
  operationalMetrics: OperationalMetric[];
  customerMetrics: CustomerMetric[];
  innovationMetrics: InnovationMetric[];
  revenueContributors: RevenueContributor[];
  yearlyTrends: YearlyTrend[];
  expenseBreakdowns: ExpenseBreakdown[];
  departments: DepartmentData[];
};

// Monthly Revenue Type
export type MonthlyRevenue = {
  month: string;
  revenue: number;
  expenses: number;
  target?: number;
};
