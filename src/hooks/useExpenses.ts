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
      
      // Convert date strings to Date objects
      const formattedExpenses = (data || []).map(expense => ({
        ...expense,
        date: new Date(expense.date),
        created_at: new Date(expense.created_at),
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

  return {
    loading,
    error,
    categories,
    expenses,
    fetchCategories,
    fetchExpenses,
    loadInitialData,
    addCategory,
    addExpense,
  };
};
