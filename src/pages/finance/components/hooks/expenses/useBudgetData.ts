
import { useState, useEffect } from "react";
import { useDepartments } from "@/hooks/useDepartments";
import { useExpenses } from "@/hooks/useExpenses";
import { BudgetCategory } from "../../../components/budget/ExpenseBudgetSection";

export function useBudgetData() {
  const [budgetView, setBudgetView] = useState<"current">("current");
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const { departments, loading: departmentsLoading } = useDepartments();
  const { expenses } = useExpenses();

  useEffect(() => {
    // Generate dynamic budget categories based on department data
    if (!departmentsLoading && departments.length > 0) {
      const departmentBudgets = departments.map((department): BudgetCategory => {
        // Calculate current expenses for this department
        const departmentExpenses = expenses
          .filter(expense => expense.department === department)
          .reduce((sum, expense) => sum + expense.amount, 0);

        // Set budget limits based on department name (in a real app, this would come from a database)
        let totalBudget = 25000000; // Default budget
        
        // Assign different budgets based on department name
        if (department.toLowerCase().includes('marketing')) {
          totalBudget = 50000000;
        } else if (department.toLowerCase().includes('it')) {
          totalBudget = 30000000;
        } else if (department.toLowerCase().includes('operation')) {
          totalBudget = 25000000;
        } else if (department.toLowerCase().includes('hr') || department.toLowerCase().includes('human')) {
          totalBudget = 15000000;
        } else if (department.toLowerCase().includes('finance')) {
          totalBudget = 20000000;
        }

        // Calculate percentage used
        const usedPercentage = totalBudget > 0 ? Math.round((departmentExpenses / totalBudget) * 100) : 0;

        // Determine status based on percentage
        let status: "safe" | "warning" | "over" = "safe";
        if (usedPercentage > 100) {
          status = "over";
        } else if (usedPercentage > 75) {
          status = "warning";
        }

        return {
          name: department,
          current: departmentExpenses,
          total: totalBudget,
          usedPercentage: usedPercentage,
          status: status
        };
      });

      setBudgetCategories(departmentBudgets);
    }
  }, [departments, departmentsLoading, expenses]);

  return {
    budgetView,
    budgetCategories
  };
}
