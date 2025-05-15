
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";

export interface ExpensesContextType {
  expenses: Expense[];
  categories: ExpenseCategory[];
  loading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<Expense[]>;
  fetchCategories: () => Promise<ExpenseCategory[]>;
  refreshData: () => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<boolean>;
}

export interface ExpensesProviderProps {
  children: React.ReactNode;
}
