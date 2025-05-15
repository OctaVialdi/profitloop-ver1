
import { useState } from "react";
import { BudgetCategory } from "../../../components/budget/ExpenseBudgetSection";

export function useBudgetData() {
  const [budgetView, setBudgetView] = useState<"current" | "forecast">("current");

  // Static budget data
  const budgetCategories: BudgetCategory[] = [
    {
      name: "Marketing",
      current: 5000000,
      total: 50000000,
      usedPercentage: 10,
      status: "safe" as "safe" | "warning" | "over"
    },
    {
      name: "IT",
      current: 15000000,
      total: 30000000,
      usedPercentage: 50,
      status: "warning" as "safe" | "warning" | "over"
    },
    {
      name: "Operations",
      current: 0,
      total: 25000000,
      usedPercentage: 0,
      status: "safe" as "safe" | "warning" | "over"
    },
    {
      name: "HR",
      current: 0,
      total: 15000000,
      usedPercentage: 0,
      status: "safe" as "safe" | "warning" | "over"
    }
  ];

  const handleBudgetViewChange = (value: string) => {
    if (value === "forecast") {
      window.location.href = "/finance/expenses/budget/forecast";
    } else {
      setBudgetView("current");
    }
  };

  return {
    budgetView,
    budgetCategories,
    handleBudgetViewChange
  };
}
