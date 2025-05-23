
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";
import { startOfMonth, endOfMonth, isWithinInterval, subMonths } from "date-fns";

export function useExpenseStats(expenses: Expense[], categories: ExpenseCategory[], dateFilter?: string) {
  return useMemo(() => {
    if (expenses.length === 0) {
      return {
        totalExpense: 0,
        currentMonthExpense: 0,
        previousMonthExpense: 0,
        highestExpense: { amount: 0, description: 'N/A', date: 'N/A' },
        latestExpense: { amount: 0, description: 'N/A', date: 'N/A' },
        expenseBreakdownData: []
      };
    }

    // Get current date and month boundaries
    const currentDate = new Date();
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    
    // Calculate current month expenses
    const currentMonthExpenses = expenses.filter(expense => 
      isWithinInterval(new Date(expense.date), {
        start: currentMonthStart,
        end: currentMonthEnd
      })
    );
    
    const currentMonthExpense = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount, 0
    );

    // Previous month boundaries
    const previousMonthDate = subMonths(currentDate, 1);
    const previousMonthStart = startOfMonth(previousMonthDate);
    const previousMonthEnd = endOfMonth(previousMonthDate);
    
    // Calculate previous month expenses
    const previousMonthExpenses = expenses.filter(expense =>
      isWithinInterval(new Date(expense.date), {
        start: previousMonthStart,
        end: previousMonthEnd
      })
    );
    
    const previousMonthExpense = previousMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount, 0
    );

    // Calculate month-over-month change percentage
    const monthlyChangePercentage = previousMonthExpense === 0 
      ? 100 // If there were no expenses last month, show 100% increase
      : ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100;

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

    // Group expenses by expense type for breakdown chart
    const expensesByType = expenses.reduce((acc, expense) => {
      // Use expense_type or default to 'Uncategorized'
      const expenseType = expense.expense_type || 'Uncategorized';
      if (!acc[expenseType]) {
        acc[expenseType] = 0;
      }
      acc[expenseType] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to chart data format
    const expenseBreakdownData = Object.entries(expensesByType).map(([name, value], index) => {
      // Generate a color based on index
      const colors = ['#4C6FFF', '#50D1B2', '#FFB547', '#FF6B6B', '#6C63FF', '#00C9A7'];
      return {
        name,
        value: parseFloat(((value / totalExpense) * 100).toFixed(1)),
        color: colors[index % colors.length],
        amount: formatRupiah(value)
      };
    });

    return {
      totalExpense,
      currentMonthExpense,
      previousMonthExpense,
      monthlyChangePercentage,
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
      expenseBreakdownData
    };
  }, [expenses, categories, dateFilter]);
}
