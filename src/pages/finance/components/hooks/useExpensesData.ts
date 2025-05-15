
import { useState, useEffect } from "react";
import { useExpenses, Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { startOfMonth, endOfMonth, format, subMonths } from "date-fns";
import { useBudgetData } from "./expenses/useBudgetData";
import { ExpenseBreakdownItem, MonthlyComparisonItem } from "../types/expense";

// Define color palette for charts
const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#FFBB28', '#FF8042', '#0088FE', 
  '#00C49F', '#3742fa', '#ff9ff3', '#feca57', '#ff6b6b'
];

export function useExpensesData() {
  // States for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('this_month');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

  // Budget data hook
  const { budgetCategories, budgetView, handleBudgetViewChange } = useBudgetData();

  // Expenses hook with Supabase data
  const { 
    expenses, 
    categories, 
    loading, 
    error, 
    loadInitialData 
  } = useExpenses();

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Filter expenses based on search, date, department, and type
  useEffect(() => {
    if (!expenses.length) {
      setFilteredExpenses([]);
      return;
    }

    let filtered = [...expenses];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.description?.toLowerCase().includes(search) ||
        expense.category?.toLowerCase().includes(search) ||
        expense.department?.toLowerCase().includes(search) ||
        expense.amount.toString().includes(search)
      );
    }

    // Apply date filter
    if (dateFilter && dateFilter !== 'all') {
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          const today = format(now, 'yyyy-MM-dd');
          filtered = filtered.filter(expense => {
            const expenseDate = expense.date instanceof Date 
              ? format(expense.date, 'yyyy-MM-dd')
              : format(new Date(expense.date), 'yyyy-MM-dd');
            return expenseDate === today;
          });
          break;
        case 'this_week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
          filtered = filtered.filter(expense => {
            const expenseDate = expense.date instanceof Date 
              ? expense.date
              : new Date(expense.date);
            return expenseDate >= weekStart && expenseDate <= now;
          });
          break;
        case 'this_month':
          const monthStart = startOfMonth(now);
          const monthEnd = endOfMonth(now);
          filtered = filtered.filter(expense => {
            const expenseDate = expense.date instanceof Date 
              ? expense.date
              : new Date(expense.date);
            return expenseDate >= monthStart && expenseDate <= monthEnd;
          });
          break;
        case 'last_month':
          const lastMonth = subMonths(now, 1);
          const lastMonthStart = startOfMonth(lastMonth);
          const lastMonthEnd = endOfMonth(lastMonth);
          filtered = filtered.filter(expense => {
            const expenseDate = expense.date instanceof Date 
              ? expense.date
              : new Date(expense.date);
            return expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd;
          });
          break;
        case 'this_year':
          const yearStart = new Date(now.getFullYear(), 0, 1);
          filtered = filtered.filter(expense => {
            const expenseDate = expense.date instanceof Date 
              ? expense.date
              : new Date(expense.date);
            return expenseDate >= yearStart && expenseDate <= now;
          });
          break;
      }
    }

    // Apply department filter
    if (departmentFilter && departmentFilter !== 'all') {
      filtered = filtered.filter(expense => 
        expense.department === departmentFilter
      );
    }

    // Apply type filter
    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(expense => 
        expense.expense_type === typeFilter
      );
    }

    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, dateFilter, departmentFilter, typeFilter]);

  // Calculate expense statistics
  const totalExpense = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate current month data
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = expense.date instanceof Date 
      ? expense.date
      : new Date(expense.date);
    return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
  });
  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate previous month data for comparison
  const previousMonth = subMonths(now, 1);
  const previousMonthStart = startOfMonth(previousMonth);
  const previousMonthEnd = endOfMonth(previousMonth);
  const previousMonthExpenses = expenses.filter(expense => {
    const expenseDate = expense.date instanceof Date 
      ? expense.date
      : new Date(expense.date);
    return expenseDate >= previousMonthStart && expenseDate <= previousMonthEnd;
  });
  const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate percentage change
  const percentageChange = previousMonthTotal === 0 
    ? 100 
    : ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
  
  // Find highest expense
  const highestExpense = expenses.length 
    ? expenses.reduce((max, expense) => expense.amount > max.amount ? expense : max, expenses[0]) 
    : null;
  
  // Find latest expense
  const latestExpense = expenses.length 
    ? [...expenses].sort((a, b) => {
        const dateA = a.created_at instanceof Date ? a.created_at : new Date(a.created_at);
        const dateB = b.created_at instanceof Date ? b.created_at : new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
      })[0]
    : null;

  // Get unique departments and expense types for filters
  const uniqueDepartments = Array.from(new Set(expenses
    .map(expense => expense.department)
    .filter(Boolean))) as string[];
  
  const uniqueExpenseTypes = Array.from(new Set(expenses
    .map(expense => expense.expense_type)
    .filter(Boolean))) as string[];

  // Create expense breakdown data for pie chart
  const categoryGroups: Record<string, number> = {};
  filteredExpenses.forEach(expense => {
    const category = expense.category || 'Uncategorized';
    categoryGroups[category] = (categoryGroups[category] || 0) + expense.amount;
  });

  const expenseBreakdownData: ExpenseBreakdownItem[] = Object.entries(categoryGroups)
    .map(([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));

  // Create monthly comparison data for bar chart using actual expense data
  const monthlyData: Record<string, number> = {};
  
  // Get current month and previous 5 months
  for (let i = 0; i < 6; i++) {
    const month = subMonths(now, i);
    const monthKey = format(month, 'MMM');
    
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    // Get actual expenses for this month
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = expense.date instanceof Date 
        ? expense.date
        : new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });
    
    monthlyData[monthKey] = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }
  
  const monthlyComparisonData: MonthlyComparisonItem[] = Object.entries(monthlyData)
    .map(([month, amount]) => ({
      name: month,
      amount,
      expense: amount,
      income: 0
    }))
    .reverse();

  // Format recurring expenses
  const recurringExpenses = expenses.filter(expense => expense.is_recurring);
  
  const formattedRecurringExpenses = recurringExpenses.map(expense => {
    const categoryName = expense.category || 'Uncategorized';
    
    return {
      id: expense.id,
      name: expense.description || categoryName,
      amount: expense.amount,
      frequency: expense.recurring_frequency || 'Monthly',
      category: categoryName,
      department: expense.department || 'General'
    };
  });

  // Tab handling
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Refresh data
  const refreshData = async () => {
    await loadInitialData();
  };

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
    handleBudgetViewChange,
    budgetCategories,
    totalExpense,
    currentMonthTotal,
    previousMonthTotal,
    percentageChange,
    highestExpense,
    latestExpense,
    expenseBreakdownData,
    monthlyComparisonData,
    formattedRecurringExpenses,
    uniqueDepartments,
    uniqueExpenseTypes
  };
}
