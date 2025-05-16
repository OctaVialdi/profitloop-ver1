
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import { uploadFileToBucket } from "@/integrations/supabase/storage";
import { format } from "date-fns";
import { clearExpenseTypeCache } from "@/pages/finance/components/expense-dialog/categoryExpenseTypeMap";

export type Expense = {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category_id: string;
  category: string; // Added direct category name field
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
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
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

      if (fetchError) {
        throw fetchError;
      }
      
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
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!organization?.id) {
        console.error("No organization ID found");
        setError("No organization ID found");
        return [];
      }
      
      // Join with expense_categories to get the category name
      const { data, error: fetchError } = await supabase
        .from("expenses")
        .select(`
          *,
          expense_categories (id, name)
        `)
        .eq("organization_id", organization.id)
        .order("date", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }
      
      // Convert date strings to Date objects and add category name directly to expense object
      const formattedExpenses = (data || []).map(expense => ({
        ...expense,
        date: new Date(expense.date),
        created_at: new Date(expense.created_at),
        category: expense.expense_categories?.name || ''
      }));
      
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
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Starting to load expense data...");
      // First fetch categories
      await fetchCategories();
      console.log("Categories loaded, now fetching expenses...");
      // Then fetch expenses (which may need categories)
      await fetchExpenses();
      console.log("All data successfully loaded!");
    } catch (error: any) {
      console.error("Error loading initial expense data:", error);
      setError(error.message || "Failed to load expense data");
      toast({
        title: "Error",
        description: "Failed to load expense data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string, description?: string) => {
    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      const { data: existingCategory, error: checkError } = await supabase
        .from("expense_categories")
        .select("*")
        .eq("name", name)
        .eq("organization_id", organization.id)
        .maybeSingle();

      if (checkError) throw checkError;
      
      // Return existing category if it already exists
      if (existingCategory) {
        toast({
          title: "Category Exists",
          description: "This category already exists",
        });
        return existingCategory;
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
      
      // Clear the expense type cache to ensure fresh data
      if (typeof window !== 'undefined' && 
          typeof window.clearExpenseTypeCache === 'function') {
        window.clearExpenseTypeCache();
      }
      
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

  const deleteExpenseCategory = async (categoryId: string) => {
    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      setLoading(true);
      
      // First check if there are expenses using this category
      const { count, error: countError } = await supabase
        .from("expenses")
        .select("id", { count: 'exact', head: true })
        .eq("category_id", categoryId);
        
      if (countError) throw countError;
      
      if (count && count > 0) {
        throw new Error(`Cannot delete category because it's used by ${count} expenses`);
      }
      
      // Delete any category-type mappings for this category
      await supabase
        .from("expense_category_types")
        .delete()
        .eq("category_id", categoryId);
      
      // Delete the category
      const { error } = await supabase
        .from("expense_categories")
        .delete()
        .eq("id", categoryId)
        .eq("organization_id", organization.id);
        
      if (error) throw error;
      
      await fetchCategories();
      
      // Clear the expense type cache to ensure fresh data
      if (typeof window !== 'undefined' && 
          typeof window.clearExpenseTypeCache === 'function') {
        window.clearExpenseTypeCache();
      }
      
      return true;
    } catch (error: any) {
      console.error("Error deleting category:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadReceipt = async (file: File) => {
    try {
      if (!file || !organization?.id) {
        throw new Error("Missing file or organization ID");
      }

      console.log("Starting file upload:", file.name);
      
      // Ensure bucket exists - this is being handled in SQL migration now
      const fileExt = file.name.split('.').pop();
      const filePath = `${organization.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log("Uploading to path:", filePath);
      
      const { url, error } = await uploadFileToBucket(
        "expense-receipts",
        filePath,
        file
      );

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }
      
      console.log("Upload successful, URL:", url);
      return { url, filePath };
    } catch (error: any) {
      console.error("Error uploading receipt:", error);
      throw error;
    }
  };

  const addExpense = async (expenseData: {
    amount: number;
    date: Date;
    category: string; // Now using category name directly
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
        try {
          console.log("Starting receipt upload");
          const uploadResult = await uploadReceipt(expenseData.receipt);
          receiptUrl = uploadResult.url;
          receiptPath = uploadResult.filePath;
          console.log("Receipt uploaded successfully:", receiptUrl);
        } catch (uploadError: any) {
          console.error("Receipt upload failed:", uploadError);
          toast({
            title: "Upload Error",
            description: "Failed to upload receipt, but continuing with expense submission",
            variant: "destructive",
          });
        }
      }

      // Get user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // Find category ID from name
      console.log("Looking for category:", expenseData.category);
      const { data: categoryData, error: categoryError } = await supabase
        .from("expense_categories")
        .select("id")
        .eq("name", expenseData.category)
        .eq("organization_id", organization.id)
        .single();

      if (categoryError || !categoryData) {
        console.error("Category error:", categoryError);
        throw new Error(`Category ${expenseData.category} not found`);
      }
      
      console.log("Found category ID:", categoryData.id);

      // Format date to string for database
      const formattedDate = format(expenseData.date, 'yyyy-MM-dd');
      
      const expenseInsertData = {
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
        created_by: user.id
      };
      
      console.log("Inserting expense data:", expenseInsertData);

      // Insert expense
      const { data, error } = await supabase
        .from("expenses")
        .insert(expenseInsertData)
        .select();

      if (error) {
        console.error("Error inserting expense:", error);
        throw error;
      }

      console.log("Expense added successfully:", data);
      
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

  // New function to update an existing expense
  const updateExpense = async (expenseId: string, expenseData: {
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
        try {
          console.log("Starting receipt upload");
          const uploadResult = await uploadReceipt(expenseData.receipt);
          receiptUrl = uploadResult.url;
          receiptPath = uploadResult.filePath;
          console.log("Receipt uploaded successfully:", receiptUrl);
        } catch (uploadError: any) {
          console.error("Receipt upload failed:", uploadError);
          toast({
            title: "Upload Error",
            description: "Failed to upload receipt, but continuing with expense update",
            variant: "destructive",
          });
        }
      }

      // Find category ID from name
      const { data: categoryData, error: categoryError } = await supabase
        .from("expense_categories")
        .select("id")
        .eq("name", expenseData.category)
        .eq("organization_id", organization.id)
        .single();

      if (categoryError || !categoryData) {
        console.error("Category error:", categoryError);
        throw new Error(`Category ${expenseData.category} not found`);
      }

      // Format date to string for database
      const formattedDate = format(expenseData.date, 'yyyy-MM-dd');
      
      const expenseUpdateData: any = {
        amount: expenseData.amount,
        date: formattedDate,
        category_id: categoryData.id,
        description: expenseData.description,
        department: expenseData.department,
        expense_type: expenseData.expenseType,
        is_recurring: expenseData.isRecurring,
        recurring_frequency: expenseData.recurringFrequency,
      };

      // Only update receipt fields if a new receipt was uploaded
      if (receiptUrl) {
        expenseUpdateData.receipt_url = receiptUrl;
        expenseUpdateData.receipt_path = receiptPath;
      }
      
      // Update expense
      const { data, error } = await supabase
        .from("expenses")
        .update(expenseUpdateData)
        .eq("id", expenseId)
        .eq("organization_id", organization.id)
        .select();

      if (error) {
        console.error("Error updating expense:", error);
        throw error;
      }

      console.log("Expense updated successfully:", data);
      
      toast({
        title: "Expense Updated",
        description: "Your expense has been updated successfully",
      });

      await fetchExpenses();
      return data?.[0];
    } catch (error: any) {
      console.error("Error updating expense:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update expense",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      setLoading(true);
      
      // First, get the expense to check if it has a receipt
      const { data: expenseData, error: fetchError } = await supabase
        .from("expenses")
        .select("receipt_path")
        .eq("id", expenseId)
        .eq("organization_id", organization.id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Delete the expense from the database
      const { error: deleteError } = await supabase
        .from("expenses")
        .delete()
        .eq("id", expenseId)
        .eq("organization_id", organization.id);

      if (deleteError) {
        throw deleteError;
      }
      
      // If the expense had a receipt, delete it from storage
      if (expenseData?.receipt_path) {
        const { error: storageError } = await supabase.storage
          .from("expense-receipts")
          .remove([expenseData.receipt_path]);
          
        if (storageError) {
          console.error("Error deleting receipt file:", storageError);
          // Continue with success even if file deletion fails
        }
      }
      
      toast({
        title: "Expense Deleted",
        description: "The expense has been deleted successfully",
      });

      // Refresh the expenses list
      await fetchExpenses();
      
      return true;
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete expense",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    categories,
    expenses,
    fetchCategories,
    fetchExpenses,
    loadInitialData,
    addCategory,
    deleteExpenseCategory,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};

// Make clearExpenseTypeCache globally available
if (typeof window !== 'undefined') {
  window.clearExpenseTypeCache = clearExpenseTypeCache;
}
