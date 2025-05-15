
import { useState } from "react";

// Define the budget category type
export interface BudgetCategory {
  name: string;
  current: number;
  total: number;
  usedPercentage: number;
  status: "safe" | "warning" | "over";
}

export function useBudgetData() {
  // State for budget view (can be month/quarter/year)
  const [budgetView, setBudgetView] = useState("current");
  
  // Handle budget view change
  const handleBudgetViewChange = (view: string) => {
    setBudgetView(view);
  };
  
  // Mock budget data
  const budgetCategories: BudgetCategory[] = [
    {
      name: "Office Supplies",
      current: 1200000,
      total: 2000000,
      usedPercentage: 60,
      status: "safe"
    },
    {
      name: "Marketing & Advertising",
      current: 4500000,
      total: 5000000,
      usedPercentage: 90,
      status: "warning"
    },
    {
      name: "Travel & Transportation",
      current: 3200000,
      total: 3000000,
      usedPercentage: 107,
      status: "over"
    },
    {
      name: "Employee Benefits",
      current: 8000000,
      total: 15000000,
      usedPercentage: 53,
      status: "safe"
    }
  ];
  
  return {
    budgetView,
    budgetCategories,
    handleBudgetViewChange
  };
}
