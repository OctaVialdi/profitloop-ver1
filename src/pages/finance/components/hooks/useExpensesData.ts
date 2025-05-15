
import { useState, useCallback, useEffect } from "react";
import { useExpenses, Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { useExpenseStats } from "./expenses/useExpenseStats";
import { useExpenseFilters } from "./expenses/useExpenseFilters";
import { useBudgetData } from "./expenses/useBudgetData";
import { useRecurringExpenses } from "./expenses/useRecurringExpenses";
import { useTabManagement } from "./expenses/useTabManagement";

export function useExpensesData() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  // Initialize hooks
  const {
    loadInitialData,
    fetchExpenses,
    fetchCategories,
  } = useExpenses();

  // Tabs management hook
  const { activeTab, handleTabChange } = useTabManagement();

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await loadInitialData();
        const expensesData = await fetchExpenses();
        const categoriesData = await fetchCategories();
        
        setExpenses(expensesData || []);
        setCategories(categoriesData || []);
      } catch (error: any) {
        console.error("Error loading expense data:", error);
        setError(error.message || "Failed to load expense data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Refresh data function for retrying after errors
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const expensesData = await fetchExpenses();
      const categoriesData = await fetchCategories();
      
      setExpenses(expensesData || []);
      setCategories(categoriesData || []);
      setError(null);
    } catch (error: any) {
      console.error("Error refreshing data:", error);
      setError(error.message || "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses, fetchCategories]);

  // Filter and search functionality
  const {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    departmentFilter,
    setDepartmentFilter,
    typeFilter,
    setTypeFilter,
    filteredExpenses,
    uniqueDepartments,
    uniqueExpenseTypes
  } = useExpenseFilters(expenses);

  // Get stats based on expenses
  const {
    totalExpense,
    currentMonthTotal,
    previousMonthTotal,
    monthOverMonthChange,
    formattedHighestExpense,
    formattedLatestExpense,
    expenseBreakdownData,
    monthlyComparisonData
  } = useExpenseStats(expenses, categories);

  // Get budget data
  const { budgetView, budgetCategories } = useBudgetData(expenses, categories);

  // Get recurring expenses
  const { formattedRecurringExpenses } = useRecurringExpenses(expenses, categories);

  return {
    loading,
    error,
    refreshData,
    expenses,
    filteredExpenses,
    categories,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    departmentFilter,
    setDepartmentFilter,
    typeFilter, 
    setTypeFilter,
    activeTab,
    handleTabChange,
    budgetView,
    budgetCategories,
    totalExpense,
    currentMonthTotal,
    previousMonthTotal,
    monthOverMonthChange,
    formattedHighestExpense,
    formattedLatestExpense,
    expenseBreakdownData,
    monthlyComparisonData,
    formattedRecurringExpenses,
    uniqueDepartments,
    uniqueExpenseTypes
  };
}
