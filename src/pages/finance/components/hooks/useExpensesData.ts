import { useState, useEffect } from "react";
import { useExpensesContext } from "@/contexts/ExpensesContext";
import { formatRupiah } from "@/utils/formatUtils";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { BudgetCategory } from "../budget/ExpenseBudgetSection";

export function useExpensesData() {
  const { expenses, categories, loading, error, refreshData } = useExpensesContext();
  
  // State for search filter
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for filters
  const [dateFilter, setDateFilter] = useState("all-time");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // State to track the active view for expense breakdown and active tab
  const [expenseView, setExpenseView] = useState<"chart" | "table">("chart");
  const [activeTab, setActiveTab] = useState<"overview" | "compliance" | "approvals">("overview");
  
  // Budget view state
  const [budgetView, setBudgetView] = useState<"current" | "forecast">("current");

  // Filtered expenses
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  
  // State for recurring expenses
  const [recurringExpenses, setRecurringExpenses] = useState<any[]>([]);

  // Debug console logs
  useEffect(() => {
    console.log("Current expenses data:", expenses);
    console.log("Current categories data:", categories);
  }, [expenses, categories]);
  
  // Apply filters when expenses, search term, or filters change
  useEffect(() => {
    console.log("Applying filters to expenses:", expenses.length);
    
    // Make sure expenses is not empty
    if (expenses.length === 0) {
      console.log("No expenses to filter");
      setFilteredExpenses([]);
      setRecurringExpenses([]);
      return;
    }
    
    let result = [...expenses];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(expense => 
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categories.find(cat => cat.id === expense.category_id)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.expense_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter !== "all-time") {
      const now = new Date();
      let startDate = new Date();
      
      if (dateFilter === "this-month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (dateFilter === "last-month") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        result = result.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate && expenseDate <= endDate;
        });
      } else if (dateFilter === "this-year") {
        startDate = new Date(now.getFullYear(), 0, 1);
      }
      
      if (dateFilter !== "last-month") {
        result = result.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate;
        });
      }
    }
    
    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(expense => 
        expense.department?.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    
    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter(expense => 
        expense.expense_type?.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    console.log("Filtered expenses:", result.length);
    setFilteredExpenses(result);

    // Set recurring expenses (filter for is_recurring === true)
    const recurring = expenses.filter(expense => expense.is_recurring === true);
    console.log("Recurring expenses:", recurring.length);
    setRecurringExpenses(recurring);
  }, [expenses, searchTerm, dateFilter, departmentFilter, typeFilter, categories]);

  // Process expenses data for charts and display
  const processExpenseData = () => {
    if (expenses.length === 0) {
      return {
        totalExpense: 0,
        highestExpense: { amount: 0, description: 'N/A', date: 'N/A' },
        latestExpense: { amount: 0, description: 'N/A', date: 'N/A' },
        expenseBreakdownData: [],
        monthlyComparisonData: []
      };
    }

    // Calculate total expense
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Find highest expense
    const highestExpense = expenses.reduce((highest, current) => 
      current.amount > highest.amount ? current : highest, expenses[0]);

    // Find latest expense by date
    const latestExpense = expenses.reduce((latest, current) => {
      const currentDate = new Date(current.date);
      const latestDate = new Date(latest.date);
      return currentDate > latestDate ? current : latest;
    }, expenses[0]);

    // Group expenses by category for breakdown chart
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const categoryName = categories.find(cat => cat.id === expense.category_id)?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to chart data format
    const expenseBreakdownData = Object.entries(expensesByCategory).map(([name, value], index) => {
      // Generate a color based on index
      const colors = ['#4C6FFF', '#50D1B2', '#FFB547', '#FF6B6B', '#6C63FF', '#00C9A7'];
      return {
        name,
        value: parseFloat(((value / totalExpense) * 100).toFixed(1)),
        color: colors[index % colors.length],
        amount: formatRupiah(value)
      };
    });

    // Generate monthly comparison data (example - in a real app, this would come from the database)
    const monthlyComparisonData = [
      { name: "Jan", expense: 10, income: 15 },
      { name: "Feb", expense: 12, income: 14 },
      { name: "Mar", expense: 16, income: 18 },
      { name: "Apr", expense: 18, income: 22 },
      { name: "May", expense: 14, income: 19 },
      { name: "Jun", expense: 20, income: 23 },
    ];

    return {
      totalExpense,
      highestExpense: {
        amount: highestExpense.amount,
        description: highestExpense.description || 'N/A',
        date: new Date(highestExpense.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      },
      latestExpense: {
        amount: latestExpense.amount,
        description: latestExpense.description || 'N/A',
        date: new Date(latestExpense.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      },
      expenseBreakdownData,
      monthlyComparisonData
    };
  };

  // Format recurring expense data for display
  const formatRecurringExpenseData = () => {
    if (recurringExpenses.length === 0) {
      return [];
    }

    console.log("Formatting recurring expenses:", recurringExpenses);

    // Convert recurring expenses to the display format
    return recurringExpenses.map(expense => {
      // Find category name
      const categoryName = categories.find(cat => cat.id === expense.category_id)?.name || 'Uncategorized';
      
      // Format date
      const formattedDate = expense.date ? new Date(expense.date).toLocaleDateString('id-ID', { 
        day: '2-digit', month: 'short', year: 'numeric' 
      }) : 'N/A';
      
      return {
        title: expense.description || categoryName,
        amount: formatRupiah(expense.amount),
        category: categoryName,
        date: formattedDate,
        frequency: expense.recurring_frequency || "Monthly",
        isPaid: true // Assuming all recorded expenses are paid
      };
    });
  };

  // Budget data from ExpenseBudget.tsx
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

  // Get unique departments and expense types for filters
  const uniqueDepartments = Array.from(
    new Set(expenses.map(e => e.department).filter(Boolean))
  ) as string[];
  
  const uniqueExpenseTypes = Array.from(
    new Set(expenses.map(e => e.expense_type).filter(Boolean))
  ) as string[];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "overview" | "compliance" | "approvals");
  };

  // Handle budget view selection
  const handleBudgetViewChange = (value: string) => {
    if (value === "forecast") {
      window.location.href = "/finance/expenses/budget/forecast";
    } else {
      setBudgetView("current");
    }
  };

  const {
    totalExpense,
    highestExpense,
    latestExpense,
    expenseBreakdownData,
    monthlyComparisonData
  } = processExpenseData();

  const formattedRecurringExpenses = formatRecurringExpenseData();

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
    expenseView,
    setExpenseView,
    activeTab,
    handleTabChange,
    budgetView,
    handleBudgetViewChange,
    budgetCategories,
    totalExpense,
    highestExpense,
    latestExpense,
    expenseBreakdownData,
    monthlyComparisonData,
    formattedRecurringExpenses,
    uniqueDepartments,
    uniqueExpenseTypes
  };
}
