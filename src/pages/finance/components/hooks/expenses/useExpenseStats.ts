
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";
import { startOfMonth, endOfMonth, isWithinInterval, subMonths, format as dateFormat } from "date-fns";

export function useExpenseStats(expenses: Expense[], categories: ExpenseCategory[]) {
  return useMemo(() => {
    // Default state when no expenses
    if (expenses.length === 0) {
      return {
        totalExpense: 0,
        currentMonthTotal: 0,
        previousMonthTotal: 0,
        monthOverMonthChange: 0,
        formattedHighestExpense: { amount: 0, description: 'N/A', date: 'N/A' },
        formattedLatestExpense: { amount: 0, description: 'N/A', date: 'N/A' },
        expenseBreakdownData: [],
        monthlyComparisonData: []
      };
    }

    // Get current date for calculations
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    
    // Get previous month for calculations
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    // Filter expenses for current month
    const currentMonthExpenses = expenses.filter(expense => 
      isWithinInterval(new Date(expense.date), {
        start: currentMonthStart,
        end: currentMonthEnd
      })
    );

    // Filter expenses for previous month
    const previousMonthExpenses = expenses.filter(expense => 
      isWithinInterval(new Date(expense.date), {
        start: previousMonthStart,
        end: previousMonthEnd
      })
    );

    // Calculate totals
    const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate month over month change percentage
    let monthOverMonthChange = 0;
    if (previousMonthTotal > 0) {
      monthOverMonthChange = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    } else if (currentMonthTotal > 0) {
      monthOverMonthChange = 100; // If previous month was 0, it's a 100% increase
    }

    // Calculate total expense (all time)
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

    // Format expense objects for display
    const formattedHighestExpense = {
      amount: highestExpense.amount,
      description: highestExpense.description || 'N/A',
      date: new Date(highestExpense.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const formattedLatestExpense = {
      amount: latestExpense.amount,
      description: latestExpense.description || 'N/A',
      date: new Date(latestExpense.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };

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

    // Generate real monthly comparison data
    // First, group expenses by month
    const monthlyData: Record<string, { expense: number, income: number }> = {};
    
    // Look back 6 months
    for (let i = 0; i < 6; i++) {
      const monthDate = subMonths(now, i);
      const monthKey = dateFormat(monthDate, "MMM");
      monthlyData[monthKey] = { expense: 0, income: 0 };
    }
    
    // Aggregate expenses by month
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const monthDiff = (now.getFullYear() - expenseDate.getFullYear()) * 12 + (now.getMonth() - expenseDate.getMonth());
      
      // Only include the last 6 months
      if (monthDiff >= 0 && monthDiff < 6) {
        const monthKey = dateFormat(expenseDate, "MMM");
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].expense += expense.amount / 1000; // Converting to thousands for display
        }
      }
    });
    
    // Convert to array format for the chart
    // Note: We're not implementing income data yet as it would require additional data source
    const monthlyComparisonData = Object.entries(monthlyData)
      .map(([name, data]) => ({
        name,
        expense: Math.round(data.expense), // Round to whole numbers for cleaner display
        income: Math.round(data.income || (data.expense * 1.2)) // Placeholder: Using 1.2x expense for income
      }))
      .reverse(); // To show oldest to newest

    return {
      totalExpense,
      currentMonthTotal,
      previousMonthTotal,
      monthOverMonthChange,
      formattedHighestExpense,
      formattedLatestExpense,
      expenseBreakdownData,
      monthlyComparisonData
    };
  }, [expenses, categories]);
}
