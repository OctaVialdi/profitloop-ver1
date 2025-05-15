
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";

export function useExpenseStats(expenses: Expense[], categories: ExpenseCategory[]) {
  return useMemo(() => {
    if (expenses.length === 0) {
      return {
        totalExpense: 0,
        currentMonthExpense: 0,
        highestExpense: { amount: 0, description: 'N/A', date: 'N/A' },
        latestExpense: { amount: 0, description: 'N/A', date: 'N/A' },
        expenseBreakdownData: [],
        monthlyComparisonData: []
      };
    }

    // Calculate total expense
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate current month expense
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const currentMonthExpense = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

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

    // Generate monthly comparison data based on actual expenses
    const monthlyData: Record<string, {expense: number, income: number}> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize last 6 months data
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = monthNames[month.getMonth()];
      monthlyData[monthKey] = { expense: 0, income: 0 };
    }
    
    // Fill with actual expense data
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const monthName = monthNames[expenseDate.getMonth()];
      
      // Only consider expenses from the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      
      if (expenseDate >= sixMonthsAgo && monthlyData[monthName]) {
        monthlyData[monthName].expense += expense.amount;
      }
    });
    
    // Convert to array format for the chart
    const monthlyComparisonData = Object.entries(monthlyData).map(([name, data]) => ({
      name,
      expense: Math.round(data.expense / 1000), // Convert to thousands for display
      income: Math.round((data.expense * 1.2) / 1000) // Placeholder for income (just for demo)
    }));

    return {
      totalExpense,
      currentMonthExpense,
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
  }, [expenses, categories]);
}
