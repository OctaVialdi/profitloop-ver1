
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";

export function useRecurringExpenses(expenses: Expense[], categories: ExpenseCategory[]) {
  return useMemo(() => {
    // Filter recurring expenses
    const recurringExpenses = expenses.filter(expense => expense.is_recurring);
    
    // Format them for display
    return recurringExpenses.map(expense => {
      const category = categories.find(cat => cat.id === expense.category_id);
      
      return {
        title: expense.description || "Unnamed Expense",
        amount: formatRupiah(expense.amount),
        category: category?.name || "Uncategorized",
        date: new Date(expense.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        frequency: expense.recurring_frequency || "Monthly",
        isPaid: Math.random() > 0.5 // This is just a placeholder since we don't track payment status
      };
    });
  }, [expenses, categories]);
}
