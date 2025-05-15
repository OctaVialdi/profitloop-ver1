
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function useExpenseStats(expenses: Expense[], categories: ExpenseCategory[]) {
  return useMemo(() => {
    if (expenses.length === 0) {
      return {
        totalExpense: 0,
        currentMonthExpense: 0,
        previousMonthExpense: 0,
        highestExpense: { amount: 0, description: 'N/A', date: 'N/A' },
        latestExpense: { amount: 0, description: 'N/A', date: 'N/A' },
        expenseBreakdownData: [],
        monthlyComparisonData: []
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
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    
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

    // Generate monthly comparison data from actual expenses
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.getMonth(),
        year: date.getFullYear(),
        name: date.toLocaleString('default', { month: 'short' })
      };
    }).reverse();

    const monthlyComparisonData = last6Months.map(monthData => {
      const monthStart = new Date(monthData.year, monthData.month, 1);
      const monthEnd = new Date(monthData.year, monthData.month + 1, 0);
      
      const monthExpenses = expenses.filter(expense => 
        isWithinInterval(new Date(expense.date), { start: monthStart, end: monthEnd })
      );
      
      const totalMonthExpense = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // For income, we could replace with actual income data if available
      // For now, using a simple estimation based on expenses
      const estimatedIncome = totalMonthExpense * (1 + (Math.random() * 0.5));
      
      return {
        name: monthData.name,
        expense: Math.round(totalMonthExpense / 1000000), // Convert to millions for display
        income: Math.round(estimatedIncome / 1000000)     // Convert to millions for display
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
      expenseBreakdownData,
      monthlyComparisonData
    };
  }, [expenses, categories]);
}
