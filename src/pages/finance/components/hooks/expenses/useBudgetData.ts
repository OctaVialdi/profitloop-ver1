
import { useState } from "react";

// Budget category with monthly allocation and spending data
export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  percentUsed: number;
}

export function useBudgetData() {
  // View toggle state (monthly, quarterly, annual)
  const [budgetView, setBudgetView] = useState<"monthly" | "quarterly" | "annual">("monthly");
  
  // Sample budget categories with spending data
  // In a real application, this would be fetched from an API
  const budgetCategories: BudgetCategory[] = [
    {
      name: "Office Supplies",
      allocated: 2000000,
      spent: 1500000,
      percentUsed: 75,
    },
    {
      name: "Marketing",
      allocated: 5000000,
      spent: 4200000,
      percentUsed: 84,
    },
    {
      name: "IT Equipment",
      allocated: 10000000,
      spent: 3500000,
      percentUsed: 35,
    },
    {
      name: "Travel",
      allocated: 3500000,
      spent: 1200000,
      percentUsed: 34,
    },
    {
      name: "Training",
      allocated: 2500000,
      spent: 500000,
      percentUsed: 20,
    },
  ];
  
  return {
    budgetView,
    setBudgetView,
    budgetCategories
  };
}
