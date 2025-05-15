
import { useState } from "react";

export type BudgetViewType = "monthly" | "quarterly" | "yearly";
export type BudgetStatusType = "safe" | "warning" | "over";

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  status: BudgetStatusType;
  percent: number;
}

const mockBudgetData: BudgetCategory[] = [
  {
    id: '1',
    name: 'Marketing',
    budgeted: 10000000,
    spent: 7500000,
    remaining: 2500000,
    status: 'safe',
    percent: 75
  },
  {
    id: '2',
    name: 'Operations',
    budgeted: 15000000,
    spent: 13000000,
    remaining: 2000000,
    status: 'warning',
    percent: 86.7
  },
  {
    id: '3',
    name: 'IT Infrastructure',
    budgeted: 5000000,
    spent: 5200000,
    remaining: -200000,
    status: 'over',
    percent: 104
  },
  {
    id: '4',
    name: 'Office Supplies',
    budgeted: 2000000,
    spent: 1200000,
    remaining: 800000,
    status: 'safe',
    percent: 60
  }
];

export function useBudgetData() {
  const [budgetView, setBudgetView] = useState<BudgetViewType>("monthly");
  const [budgetCategories] = useState<BudgetCategory[]>(mockBudgetData);

  const handleBudgetViewChange = (value: BudgetViewType) => {
    setBudgetView(value);
  };

  return {
    budgetView,
    budgetCategories,
    handleBudgetViewChange
  };
}
