
export interface ExpenseBreakdownItem {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyComparisonItem {
  name: string;
  amount: number;
  expense?: number;
  income?: number;
}

export interface RecurringExpense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  frequency: string;
  department: string;
  isPaid: boolean;
}

export type ExpenseTabType = "overview" | "compliance" | "approvals";
