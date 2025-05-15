
import { useState, useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";

export type BudgetCategory = {
  id: string;
  name: string;
  current: number;
  total: number;
  usedPercentage: number;
  status: "warning" | "safe" | "over";
};

export function useBudgetData(expenses: Expense[] = []) {
  const [budgetView, setBudgetView] = useState<string>("current");

  // Calculate department-based budget data from actual expenses
  const budgetCategories = useMemo(() => {
    // Group expenses by department
    const departmentExpenses: Record<string, number> = {};
    expenses.forEach(expense => {
      if (expense.department) {
        if (!departmentExpenses[expense.department]) {
          departmentExpenses[expense.department] = 0;
        }
        departmentExpenses[expense.department] += expense.amount;
      }
    });

    // Department budget allocation (in a real app, this would come from a budget table)
    const departmentBudgets: Record<string, number> = {
      "Office Equipment": 2000000,
      "Marketing": 4000000,
      "Office Rent": 5000000,
      "Software Subscriptions": 1000000
    };

    // Create budget categories
    return Object.entries(departmentBudgets).map(([department, total]) => {
      const current = departmentExpenses[department] || 0;
      const usedPercentage = Math.round((current / total) * 100);
      
      let status: "safe" | "warning" | "over" = "safe";
      if (usedPercentage > 100) {
        status = "over";
      } else if (usedPercentage > 90) {
        status = "warning";
      }

      return {
        id: department.toLowerCase().replace(/\s+/g, '-'),
        name: department,
        current,
        total,
        usedPercentage,
        status
      };
    });
  }, [expenses]);

  const handleBudgetViewChange = (view: string) => {
    setBudgetView(view);
  };

  return {
    budgetView,
    budgetCategories,
    handleBudgetViewChange
  };
}
