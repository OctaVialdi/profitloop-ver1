
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";

export type RecurringExpense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  isPaid: boolean;
};

export function useRecurringExpenses(expenses: Expense[], categories: ExpenseCategory[]) {
  return useMemo(() => {
    // Filter for recurring expenses
    const recurringExpenses = expenses
      .filter(expense => expense.is_recurring)
      .map(expense => {
        const category = categories.find(c => c.id === expense.category_id);
        
        return {
          id: expense.id,
          title: expense.description || `Recurring ${category?.name || 'Expense'}`,
          category: category?.name || 'Uncategorized',
          amount: expense.amount,
          date: new Date(expense.date).toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          }),
          isPaid: Math.random() > 0.5 // This would normally come from the actual data
        };
      });

    return recurringExpenses;
  }, [expenses, categories]);
}
