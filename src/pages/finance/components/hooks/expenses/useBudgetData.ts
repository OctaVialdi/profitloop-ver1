
import { useState, useMemo, useEffect } from "react";
import { Expense } from "@/hooks/useExpenses";
import { useFilteredEmployees } from "@/hooks/useFilteredEmployees";

export type BudgetCategory = {
  id: string;
  name: string;
  current: number;
  total: number;
  usedPercentage: number;
  status: "warning" | "safe" | "over";
  monthlyBudget: number;
};

export function useBudgetData(expenses: Expense[] = []) {
  const [budgetView, setBudgetView] = useState<string>("current");
  // Get unique department names from the HR employee organization field
  const { employees, isLoading: isEmployeesLoading } = useFilteredEmployees();
  const [departmentBudgets, setDepartmentBudgets] = useState<Record<string, number>>({});

  // Extract unique organization names from employees
  const uniqueDepartments = useMemo(() => {
    const departments = new Set<string>();
    
    employees.forEach(employee => {
      if (employee.organization) {
        departments.add(employee.organization);
      }
    });
    
    return Array.from(departments);
  }, [employees]);

  // Initialize department budgets if they don't exist
  useEffect(() => {
    const initialBudgets: Record<string, number> = {};
    uniqueDepartments.forEach(dept => {
      // If budget doesn't exist yet for this department, set a default
      if (!departmentBudgets[dept]) {
        initialBudgets[dept] = 2000000; // Default budget of 2 million
      }
    });

    if (Object.keys(initialBudgets).length > 0) {
      setDepartmentBudgets(prev => ({...prev, ...initialBudgets}));
    }
  }, [uniqueDepartments]);

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

    // Create budget categories from unique departments
    return uniqueDepartments.map(department => {
      const current = departmentExpenses[department] || 0;
      const total = departmentBudgets[department] || 2000000; // Default if not set
      const usedPercentage = Math.round((current / total) * 100);
      
      let status: "safe" | "warning" | "over" = "safe";
      if (usedPercentage > 100) {
        status = "over";
      } else if (usedPercentage > 80) {
        status = "warning";
      }

      return {
        id: department.toLowerCase().replace(/\s+/g, '-'),
        name: department,
        current,
        total,
        usedPercentage,
        status,
        monthlyBudget: departmentBudgets[department] || 2000000
      };
    });
  }, [expenses, uniqueDepartments, departmentBudgets]);

  const handleBudgetViewChange = (view: string) => {
    setBudgetView(view);
  };

  const updateDepartmentBudget = (department: string, budget: number) => {
    setDepartmentBudgets(prev => ({
      ...prev,
      [department]: budget
    }));
  };

  return {
    budgetView,
    budgetCategories,
    handleBudgetViewChange,
    updateDepartmentBudget,
    departmentBudgets,
    isLoading: isEmployeesLoading
  };
}
