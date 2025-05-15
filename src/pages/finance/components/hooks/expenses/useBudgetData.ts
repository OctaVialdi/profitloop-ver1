
import { useState } from "react";
import { BudgetCategory } from "../../types/expense";

// Mock data for budget categories
const initialBudgetCategories: BudgetCategory[] = [
  {
    name: "Marketing",
    current: 5000000,
    total: 50000000,
    usedPercentage: 10,
    status: "safe"
  },
  {
    name: "IT",
    current: 15000000,
    total: 30000000,
    usedPercentage: 50,
    status: "warning"
  },
  {
    name: "Operations",
    current: 7500000,
    total: 25000000,
    usedPercentage: 30,
    status: "safe"
  },
  {
    name: "HR",
    current: 3750000,
    total: 15000000,
    usedPercentage: 25,
    status: "safe"
  },
  {
    name: "Sales",
    current: 22500000,
    total: 45000000,
    usedPercentage: 50,
    status: "warning"
  }
];

export function useBudgetData() {
  const [budgetView, setBudgetView] = useState<string>("current");
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(initialBudgetCategories);

  const handleBudgetViewChange = (view: string) => {
    setBudgetView(view);
    
    // Simulate different data for different budget views
    if (view === "forecast") {
      // Forecasted budget data
      setBudgetCategories([
        {
          name: "Marketing",
          current: 8000000,
          total: 50000000,
          usedPercentage: 16,
          status: "safe"
        },
        {
          name: "IT",
          current: 22500000,
          total: 30000000,
          usedPercentage: 75,
          status: "warning"
        },
        {
          name: "Operations",
          current: 12500000,
          total: 25000000,
          usedPercentage: 50,
          status: "warning"
        },
        {
          name: "HR",
          current: 7500000,
          total: 15000000,
          usedPercentage: 50,
          status: "warning"
        },
        {
          name: "Sales",
          current: 30000000,
          total: 45000000,
          usedPercentage: 66,
          status: "warning"
        }
      ]);
    } else {
      // Current budget data (reset to initial)
      setBudgetCategories(initialBudgetCategories);
    }
  };

  return {
    budgetCategories,
    budgetView,
    handleBudgetViewChange
  };
}
