
import { useExpensesContext } from "@/contexts/expenses";
import { useExpenseFilters } from "./expenses/useExpenseFilters";
import { useExpenseStats } from "./expenses/useExpenseStats";
import { useRecurringExpenses } from "./expenses/useRecurringExpenses";
import { useBudgetData } from "./expenses/useBudgetData";
import { useTabManagement } from "./expenses/useTabManagement";

export function useExpensesData() {
  // Get data from context
  const { expenses, categories, loading, error, refreshData } = useExpensesContext();
  
  // Use specialized hooks
  const filters = useExpenseFilters(expenses, categories);
  const stats = useExpenseStats(filters.filteredExpenses, categories, filters.dateFilter);
  const formattedRecurringExpenses = useRecurringExpenses(expenses, categories);
  const budgetData = useBudgetData(expenses); 
  const tabManagement = useTabManagement();

  return {
    // Context data
    loading,
    error,
    refreshData,
    expenses,
    categories,
    
    // Filter data
    filteredExpenses: filters.filteredExpenses,
    searchTerm: filters.searchTerm,
    setSearchTerm: filters.setSearchTerm,
    dateFilter: filters.dateFilter,
    setDateFilter: filters.setDateFilter,
    departmentFilter: filters.departmentFilter,
    setDepartmentFilter: filters.setDepartmentFilter,
    typeFilter: filters.typeFilter,
    setTypeFilter: filters.setTypeFilter,
    uniqueDepartments: filters.uniqueDepartments,
    uniqueExpenseTypes: filters.uniqueExpenseTypes,
    
    // Stats data
    totalExpense: stats.totalExpense,
    currentMonthExpense: stats.currentMonthExpense,
    previousMonthExpense: stats.previousMonthExpense,
    monthlyChangePercentage: stats.monthlyChangePercentage,
    highestExpense: stats.highestExpense,
    latestExpense: stats.latestExpense,
    expenseBreakdownData: stats.expenseBreakdownData,
    
    // Recurring expenses
    formattedRecurringExpenses,
    
    // Budget data
    budgetView: budgetData.budgetView,
    budgetCategories: budgetData.budgetCategories,
    handleBudgetViewChange: budgetData.handleBudgetViewChange,
    updateDepartmentBudget: budgetData.updateDepartmentBudget,
    isLoadingDepartments: budgetData.isLoading,
    
    // Tab management
    activeTab: tabManagement.activeTab,
    expenseView: tabManagement.expenseView,
    setExpenseView: tabManagement.setExpenseView,
    handleTabChange: tabManagement.handleTabChange,
  };
}
