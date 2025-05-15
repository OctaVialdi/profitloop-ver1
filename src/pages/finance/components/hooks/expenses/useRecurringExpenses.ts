
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";

interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  formattedAmount: string;
  category: string;
  frequency: string;
  nextDate: string;
}

export function useRecurringExpenses(expenses: Expense[], categories: ExpenseCategory[]): RecurringExpense[] {
  return useMemo(() => {
    // Filter for recurring expenses
    const recurringExpenses = expenses.filter(expense => expense.is_recurring);
    
    if (recurringExpenses.length === 0) {
      return [];
    }
    
    return recurringExpenses.map(expense => {
      const category = categories.find(cat => cat.id === expense.category_id);
      
      // Calculate next date based on frequency
      const baseDate = new Date(expense.date);
      let nextDate = new Date(baseDate);
      
      // Simple calculation for next date based on frequency
      switch (expense.recurring_frequency?.toLowerCase()) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
        default:
          nextDate.setMonth(nextDate.getMonth() + 1); // Default to monthly
      }
      
      return {
        id: expense.id,
        description: expense.description || 'Unnamed Expense',
        amount: expense.amount,
        formattedAmount: formatRupiah(expense.amount),
        category: category?.name || 'Uncategorized',
        frequency: expense.recurring_frequency || 'Monthly',
        nextDate: nextDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };
    });
  }, [expenses, categories]);
}
