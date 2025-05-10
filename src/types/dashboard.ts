
// Financial summary types
export interface FinancialSummaryRecord {
  id?: string;
  organization_id: string;
  month: string;
  total_revenue: number;
  total_expenses: number;
  net_cashflow: number;
  target_revenue?: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
}

export interface OperationalMetric {
  id?: string;
  metric_name: string;
  metric_value: number;
  target_value?: number;
  metric_type: string;
  period?: string;
  unit?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface MonthlyRevenueTrendCardProps {
  data: MonthlyRevenue[];
  year: number;
}
