
import { Expense, ExpenseCategory } from '@/hooks/useExpenses';

export interface ExpensesContextType {
  expenses: Expense[];
  categories: ExpenseCategory[];
  loading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<Expense[]>;
  fetchCategories: () => Promise<ExpenseCategory[]>;
  refreshData: () => Promise<void>;
  addCategory: (name: string, description?: string) => Promise<any>;
  addExpense: (expenseData: {
    amount: number;
    date: Date;
    category: string;
    description?: string;
    department?: string;
    expenseType?: string;
    isRecurring: boolean;
    recurringFrequency?: string;
    receipt?: File;
  }) => Promise<any>;
  deleteExpense: (expenseId: string) => Promise<boolean>;
}

export interface ExpensesProviderProps {
  children: React.ReactNode;
}
