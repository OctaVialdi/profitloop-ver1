
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Expense, ExpenseCategory } from '@/hooks/useExpenses';

interface ExpensesContextType {
  expenses: Expense[];
  categories: ExpenseCategory[];
  loading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<Expense[]>;
  fetchCategories: () => Promise<ExpenseCategory[]>;
  refreshData: () => Promise<void>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchCategories = async () => {
    try {
      setError(null);
      
      if (!organization?.id) {
        console.error("No organization ID found");
        setError("No organization ID found");
        return [];
      }
      
      const { data, error: fetchError } = await supabase
        .from("expense_categories")
        .select("*")
        .eq("organization_id", organization.id)
        .order("name");

      if (fetchError) throw fetchError;
      
      console.log("Fetched expense categories:", data);
      setCategories(data || []);
      return data;
    } catch (error: any) {
      console.error("Error fetching expense categories:", error);
      setError(error.message || "Failed to fetch expense categories");
      toast({
        title: "Error",
        description: error.message || "Failed to fetch expense categories",
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchExpenses = async () => {
    try {
      setError(null);
      
      if (!organization?.id) {
        console.error("No organization ID found");
        setError("No organization ID found");
        return [];
      }
      
      const { data, error: fetchError } = await supabase
        .from("expenses")
        .select(`
          *,
          expense_categories (id, name)
        `)
        .eq("organization_id", organization.id)
        .order("date", { ascending: false });

      if (fetchError) throw fetchError;
      
      // Convert date strings to Date objects and add category name
      const formattedExpenses = (data || []).map(expense => ({
        ...expense,
        date: new Date(expense.date),
        created_at: new Date(expense.created_at),
        category: expense.expense_categories?.name || ''
      })) as Expense[];
      
      console.log("Fetched expenses:", formattedExpenses);
      setExpenses(formattedExpenses);
      return formattedExpenses;
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      setError(error.message || "Failed to fetch expenses");
      toast({
        title: "Error",
        description: error.message || "Failed to fetch expenses",
        variant: "destructive",
      });
      return [];
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchCategories();
      await fetchExpenses();
    } catch (error) {
      console.error("Error refreshing expense data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data when context is initialized
  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        await fetchCategories();
        await fetchExpenses();
      } catch (error) {
        console.error("Error loading initial expense data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [organization?.id]);

  return (
    <ExpensesContext.Provider 
      value={{ 
        expenses, 
        categories, 
        loading, 
        error, 
        fetchExpenses, 
        fetchCategories, 
        refreshData 
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpensesContext = () => {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpensesContext must be used within an ExpensesProvider');
  }
  return context;
};
