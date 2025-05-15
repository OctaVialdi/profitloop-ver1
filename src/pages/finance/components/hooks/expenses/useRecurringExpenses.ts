
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';

export type RecurringExpense = {
  id: string;
  title: string;
  description?: string;
  category: string;
  amount: number;
  date: string;
  isPaid: boolean;
  frequency: string;
};

export function useRecurringExpenses(expenses: Expense[], categories: ExpenseCategory[]) {
  return useMemo(() => {
    // Filter recurring expenses
    const recurringExpenses = expenses.filter(expense => expense.is_recurring);
    
    // Map expenses to the format expected by the component
    return recurringExpenses.map((expense) => {
      const category = categories.find(cat => cat.id === expense.category_id);
      
      return {
        id: expense.id || uuidv4(),
        title: category?.name || 'Uncategorized',
        description: expense.description || '',
        category: expense.department || 'General',
        amount: expense.amount,
        date: format(
          new Date(expense.date), 
          'dd MMM yyyy', 
          { 
            month: 'short', 
            year: 'numeric' 
          }),
        frequency: expense.recurring_frequency || 'Monthly',
        isPaid: Math.random() > 0.5 // This would normally come from the actual data
      };
    });
  }, [expenses, categories]);
}
