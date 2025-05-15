
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";
import { startOfMonth, endOfMonth, isWithinInterval, subMonths, format } from "date-fns";

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
    // Group expenses by month for the last 6 months
    const monthsToShow = 6; // Show last 6 months
    const monthlyData: Record<string, {department: number, expense: number}> = {};
    
    // Initialize with the last 6 months
    for (let i = 0; i < monthsToShow; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = format(date, 'MMM');
      monthlyData[monthKey] = { department: 0, expense: 0 };
    }
    
    // Group expenses by month and department
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      // Only consider expenses from the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - (monthsToShow - 1));
      
      if (expenseDate >= sixMonthsAgo) {
        const monthKey = format(expenseDate, 'MMM');
        
        if (monthlyData[monthKey]) {
          // Use actual expense data
          if (expense.department) {
            // If department is specified, add to department total
            monthlyData[monthKey].department += expense.amount / 1000000; // Convert to millions
          }
          // Add to overall expense total
          monthlyData[monthKey].expense += expense.amount / 1000000; // Convert to millions
        }
      }
    });
    
    // Convert to array format for the chart, sorting by month chronologically
    const monthOrder = Object.keys(monthlyData).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.substring(0, 3)) - months.indexOf(b.substring(0, 3));
    });
    
    const monthlyComparisonData = monthOrder.map(month => ({
      month,
      department: parseFloat(monthlyData[month].department.toFixed(2)),
      expense: parseFloat(monthlyData[month].expense.toFixed(2))
    }));

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
