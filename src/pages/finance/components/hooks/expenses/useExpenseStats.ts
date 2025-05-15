
import { useMemo } from 'react';
import { Expense, ExpenseCategory } from '@/hooks/useExpenses';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function useExpenseStats(expenses: Expense[], categories: ExpenseCategory[]) {
  // Calculate current month date range
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  
  // Calculate previous month date range
  const previousMonthStart = startOfMonth(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const previousMonthEnd = endOfMonth(new Date(new Date().setMonth(new Date().getMonth() - 1)));

  // Calculate total expense, highest expense, latest expense
  const expenseStats = useMemo(() => {
    // Current month expenses
    const currentMonthExpenses = expenses.filter(expense => 
      isWithinInterval(new Date(expense.date), {
        start: currentMonthStart,
        end: currentMonthEnd
      })
    );
    
    const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    
    // Previous month expenses
    const previousMonthExpenses = expenses.filter(expense => 
      isWithinInterval(new Date(expense.date), {
        start: previousMonthStart,
        end: previousMonthEnd
      })
    );
    
    const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    
    // Calculate percentage change
    let percentageChange = 0;
    if (previousMonthTotal > 0) {
      percentageChange = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    } else if (currentMonthTotal > 0) {
      percentageChange = 100;
    }
    
    // Sort expenses by amount to find highest
    const sortedByAmount = [...expenses].sort((a, b) => Number(b.amount) - Number(a.amount));
    const highestExpense = sortedByAmount.length > 0
      ? {
          amount: Number(sortedByAmount[0].amount),
          description: sortedByAmount[0].description || 'No description',
          date: format(new Date(sortedByAmount[0].date), 'MMM dd, yyyy')
        }
      : { amount: 0, description: 'No expenses', date: '' };
    
    // Sort expenses by date to find latest
    const sortedByDate = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestExpense = sortedByDate.length > 0
      ? {
          amount: Number(sortedByDate[0].amount),
          description: sortedByDate[0].description || 'No description',
          date: format(new Date(sortedByDate[0].date), 'MMM dd, yyyy')
        }
      : { amount: 0, description: 'No expenses', date: '' };
    
    // Total of all expenses
    const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    return {
      totalExpense,
      currentMonthTotal,
      previousMonthTotal,
      percentageChange,
      highestExpense,
      latestExpense
    };
  }, [expenses, currentMonthStart, currentMonthEnd, previousMonthStart, previousMonthEnd]);

  // Calculate expense breakdown by category
  const expenseBreakdownData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(expense => {
      const categoryName = expense.category || 'Uncategorized';
      const currentAmount = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentAmount + Number(expense.amount));
    });
    
    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  }, [expenses]);

  // Calculate monthly comparison data
  const monthlyComparisonData = useMemo(() => {
    // Get unique months from expenses
    const months = new Set<string>();
    
    // Create a map to store monthly expenses
    const monthlyExpenses = new Map<string, number>();
    
    // Use last 6 months for comparison
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = format(date, 'MMM');
      months.add(monthKey);
      monthlyExpenses.set(monthKey, 0);
    }

    // Aggregate expenses by month
    expenses.forEach(expense => {
      const month = format(new Date(expense.date), 'MMM');
      if (monthlyExpenses.has(month)) {
        const currentAmount = monthlyExpenses.get(month) || 0;
        monthlyExpenses.set(month, currentAmount + Number(expense.amount));
      }
    });
    
    // Generate monthly comparison data with real expense values
    // For now, we'll use a placeholder for income data (which would ideally come from another source)
    return Array.from(months).map(month => {
      const expenseValue = Math.round(monthlyExpenses.get(month) || 0) / 1000;
      // This is placeholder income data - in a real app, this would come from your income data
      const incomeValue = Math.round((monthlyExpenses.get(month) || 0) * 1.3) / 1000;
      
      return {
        name: month,
        expense: expenseValue,
        income: incomeValue
      };
    }).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.name) - months.indexOf(b.name);
    });
  }, [expenses]);

  return {
    ...expenseStats,
    expenseBreakdownData,
    monthlyComparisonData
  };
}
