
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";

export function useExpenseStats(expenses: Expense[], categories: ExpenseCategory[]) {
  return useMemo(() => {
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

    // Generate monthly comparison data
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
  }, [expenses, categories]);
}
