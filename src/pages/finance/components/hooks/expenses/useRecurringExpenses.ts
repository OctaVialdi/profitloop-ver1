
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";

export function useRecurringExpenses(expenses: Expense[], categories: ExpenseCategory[]) {
  return useMemo(() => {
    // Filter recurring expenses
    const recurringExpenses = expenses.filter(expense => expense.is_recurring === true);
    
    if (recurringExpenses.length === 0) {
      return [];
    }

    // Convert recurring expenses to the display format
    return recurringExpenses.map(expense => {
      // Find category name
      const categoryName = categories.find(cat => cat.id === expense.category_id)?.name || 'Uncategorized';
      
      // Format date
      const formattedDate = expense.date ? new Date(expense.date).toLocaleDateString('id-ID', { 
        day: '2-digit', month: 'short', year: 'numeric' 
      }) : 'N/A';
      
      return {
        title: expense.description || categoryName,
        amount: formatRupiah(expense.amount),
        category: categoryName,
        date: formattedDate,
        frequency: expense.recurring_frequency || "Monthly",
        isPaid: true // Assuming all recorded expenses are paid
      };
    });
  }, [expenses, categories]);
}
