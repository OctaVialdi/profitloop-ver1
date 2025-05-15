
import { useMemo } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";
import { format } from "date-fns";

export interface FormattedRecurringExpense {
  title: string;
  amount: string;
  category: string;
  date: string;
  frequency: string;
  isPaid: boolean;
}

export function useRecurringExpenses(expenses: Expense[], categories: ExpenseCategory[]) {
  // Filter recurring expenses and format them
  const formattedRecurringExpenses = useMemo(() => {
    const recurringExpenses = expenses.filter(expense => expense.is_recurring);
    
    return recurringExpenses.map(expense => {
      const category = categories.find(cat => cat.id === expense.category_id)?.name || expense.category;
      
      return {
        title: expense.description || "Recurring Expense",
        amount: formatRupiah(expense.amount),
        category: category,
        date: format(new Date(expense.date), "MMM d, yyyy"),
        frequency: expense.recurring_frequency || "Monthly",
        isPaid: true // Assuming paid by default, adjust if you have payment status data
      };
    });
  }, [expenses, categories]);

  return formattedRecurringExpenses;
}
