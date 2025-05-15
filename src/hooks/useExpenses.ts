
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { uploadFileToBucket } from "@/integrations/supabase/storage";
import { format } from "date-fns";

export type Expense = {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category_id: string;
  department: string;
  expense_type: string;
  is_recurring: boolean;
  recurring_frequency?: string;
  receipt_url?: string;
  receipt_path?: string;
  created_at: Date;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  description?: string;
};

export const useExpenses = () => {
  const { toast } = useToast();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("expense_categories")
        .select("*")
        .eq("organization_id", organization?.id)
        .order("name");

      if (error) throw error;
      setCategories(data || []);
      return data;
    } catch (error: any) {
      console.error("Error fetching expense categories:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch expense categories",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("expenses")
        .select(`
          *,
          expense_categories (id, name)
        `)
        .eq("organization_id", organization?.id)
        .order("date", { ascending: false });

      if (error) throw error;
      
      // Convert date strings to Date objects
      const formattedExpenses = (data || []).map(expense => ({
        ...expense,
        date: new Date(expense.date),
        created_at: new Date(expense.created_at),
      }));
      
      setExpenses(formattedExpenses);
      return formattedExpenses;
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch expenses",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string, description?: string) => {
    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      const { data, error } = await supabase
        .from("expense_categories")
        .insert([
          {
            name,
            description,
            organization_id: organization.id,
          },
        ])
        .select();

      if (error) throw error;
      toast({
        title: "Category Added",
        description: "Expense category has been added successfully",
      });
      await fetchCategories();
      return data?.[0];
    } catch (error: any) {
      console.error("Error adding expense category:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add expense category",
        variant: "destructive",
      });
      return null;
    }
  };

  const uploadReceipt = async (file: File) => {
    try {
      if (!file || !organization?.id) {
        throw new Error("Missing file or organization ID");
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${organization.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { url, error } = await uploadFileToBucket(
        "expense-receipts",
        filePath,
        file
      );

      if (error) throw error;
      return { url, filePath };
    } catch (error: any) {
      console.error("Error uploading receipt:", error);
      throw error;
    }
  };

  const addExpense = async (expenseData: {
    amount: number;
    date: Date;
    category: string;
    description?: string;
    department?: string;
    expenseType?: string;
    isRecurring: boolean;
    recurringFrequency?: string;
    receipt?: File;
  }) => {
    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      setLoading(true);

      // Upload receipt if provided
      let receiptUrl = null;
      let receiptPath = null;

      if (expenseData.receipt) {
        const uploadResult = await uploadReceipt(expenseData.receipt);
        receiptUrl = uploadResult.url;
        receiptPath = uploadResult.filePath;
      }

      // Get user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      // Find category ID from name
      const { data: categoryData } = await supabase
        .from("expense_categories")
        .select("id")
        .eq("name", expenseData.category)
        .eq("organization_id", organization.id)
        .single();

      if (!categoryData) {
        throw new Error(`Category ${expenseData.category} not found`);
      }

      // Format date to string for database
      const formattedDate = format(expenseData.date, 'yyyy-MM-dd');

      // Insert expense
      const { data, error } = await supabase
        .from("expenses")
        .insert([
          {
            amount: expenseData.amount,
            date: formattedDate,
            category_id: categoryData.id,
            description: expenseData.description,
            department: expenseData.department,
            expense_type: expenseData.expenseType,
            is_recurring: expenseData.isRecurring,
            recurring_frequency: expenseData.recurringFrequency,
            receipt_url: receiptUrl,
            receipt_path: receiptPath,
            organization_id: organization.id,
            created_by: user?.id
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Expense Added",
        description: "Your expense has been added successfully",
      });

      await fetchExpenses();
      return data?.[0];
    } catch (error: any) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add expense",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    categories,
    expenses,
    fetchCategories,
    fetchExpenses,
    addCategory,
    addExpense,
  };
};
