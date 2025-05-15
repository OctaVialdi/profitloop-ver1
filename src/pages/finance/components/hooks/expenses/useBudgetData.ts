
import { useState } from "react";

export type BudgetCategory = {
  id: string;
  name: string;
  current: number;
  total: number;
  usedPercentage: number;
  status: "warning" | "safe" | "over";
};

export function useBudgetData() {
  const [budgetView, setBudgetView] = useState<"monthly" | "quarterly" | "yearly">(
    "monthly"
  );

  // Mock data - this would normally come from the API based on budgetView
  const budgetCategories: BudgetCategory[] = [
    {
      id: "cat-1",
      name: "Office Equipment",
      current: 1500000,
      total: 2000000,
      usedPercentage: 75,
      status: "safe"
    },
    {
      id: "cat-2",
      name: "Marketing",
      current: 3800000,
      total: 4000000,
      usedPercentage: 95,
      status: "warning"
    },
    {
      id: "cat-3",
      name: "Office Rent",
      current: 5200000, 
      total: 5000000,
      usedPercentage: 104,
      status: "over"
    },
    {
      id: "cat-4",
      name: "Software Subscriptions",
      current: 800000,
      total: 1000000,
      usedPercentage: 80,
      status: "safe"
    }
  ];

  const handleBudgetViewChange = (view: "monthly" | "quarterly" | "yearly") => {
    setBudgetView(view);
  };

  return {
    budgetView,
    budgetCategories,
    handleBudgetViewChange
  };
}
