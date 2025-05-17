
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";

export interface ExpenseType {
  id: string;
  name: string;
  is_default: boolean;
  organization_id: string;
  category_id?: string;
}

export interface CategoryTypeMapping {
  id: string;
  category_id: string;
  expense_type: string;
}

export const useExpenseTypeMappings = () => {
  const { toast } = useToast();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [categoryMappings, setCategoryMappings] = useState<CategoryTypeMapping[]>([]);

  const fetchExpenseTypes = async () => {
    if (!organization?.id) return [];
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("expense_types")
        .select("*")
        .eq("organization_id", organization.id)
        .order("name");
        
      if (error) throw error;
      
      setExpenseTypes(data || []);
      return data || [];
    } catch (error: any) {
      console.error("Error fetching expense types:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch expense types",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryMappings = async () => {
    if (!organization?.id) return [];
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("expense_category_types")
        .select("*")
        .eq("organization_id", organization.id);
        
      if (error) throw error;
      
      setCategoryMappings(data || []);
      return data || [];
    } catch (error: any) {
      console.error("Error fetching category mappings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch category mappings",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createExpenseType = async (name: string, categoryId?: string) => {
    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      setLoading(true);
      
      // Check if type already exists
      const { data: existingTypes } = await supabase
        .from("expense_types")
        .select("id")
        .eq("name", name)
        .eq("organization_id", organization.id);
      
      if (existingTypes && existingTypes.length > 0) {
        toast({
          title: "Error",
          description: "Expense type already exists",
          variant: "destructive",
        });
        return null;
      }

      const newType = {
        name,
        organization_id: organization.id,
        is_default: false,
        category_id: categoryId || null
      };

      const { data, error } = await supabase
        .from("expense_types")
        .insert([newType])
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Expense type created successfully",
      });
      
      await fetchExpenseTypes();
      return data?.[0] || null;
    } catch (error: any) {
      console.error("Error creating expense type:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create expense type",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateExpenseType = async (id: string, name: string, categoryId?: string) => {
    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      setLoading(true);

      const updateData: { name: string; category_id?: string | null } = {
        name
      };
      
      // Only add category_id if it's provided
      if (categoryId !== undefined) {
        updateData.category_id = categoryId || null;
      }

      const { data, error } = await supabase
        .from("expense_types")
        .update(updateData)
        .eq("id", id)
        .eq("organization_id", organization.id)
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Expense type updated successfully",
      });
      
      await fetchExpenseTypes();
      return data?.[0] || null;
    } catch (error: any) {
      console.error("Error updating expense type:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update expense type",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpenseType = async (id: string) => {
    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      setLoading(true);
      
      // First check if it's a default type
      const { data: typeData } = await supabase
        .from("expense_types")
        .select("is_default")
        .eq("id", id)
        .single();
      
      if (typeData?.is_default) {
        toast({
          title: "Error",
          description: "Cannot delete default expense types",
          variant: "destructive",
        });
        return false;
      }

      // Delete all mappings for this type
      await supabase
        .from("expense_category_types")
        .delete()
        .eq("expense_type", id);

      // Delete the type
      const { error } = await supabase
        .from("expense_types")
        .delete()
        .eq("id", id)
        .eq("organization_id", organization.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Expense type deleted successfully",
      });
      
      await fetchExpenseTypes();
      return true;
    } catch (error: any) {
      console.error("Error deleting expense type:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete expense type",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveCategoryTypeMappings = async (mappings: Array<{categoryId: string, expenseType: string}>) => {
    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      setLoading(true);
      
      // Delete existing mappings for this organization
      await supabase
        .from("expense_category_types")
        .delete()
        .eq("organization_id", organization.id);
      
      // Insert new mappings
      if (mappings.length > 0) {
        const mappingsToInsert = mappings.map(mapping => ({
          category_id: mapping.categoryId,
          expense_type: mapping.expenseType,
          organization_id: organization.id
        }));
        
        const { error } = await supabase
          .from("expense_category_types")
          .insert(mappingsToInsert);
  
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Category-type mappings saved successfully",
      });
      
      await fetchCategoryMappings();
      return true;
    } catch (error: any) {
      console.error("Error saving category mappings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save category mappings",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Renamed function with explicit Promise<string[]> return type
  const fetchExpenseTypesForCategory = async (categoryId: string): Promise<string[]> => {
    try {
      if (!organization?.id) return [];
      
      // Get expense types directly related to this category
      const { data: directTypes, error: directError } = await supabase
        .from("expense_types")
        .select("name")
        .eq("category_id", categoryId)
        .eq("organization_id", organization.id);
      
      if (directError) throw directError;
      
      if (directTypes && directTypes.length > 0) {
        return directTypes.map(type => type.name);
      }
      
      // Get mappings for this category as fallback
      const { data, error } = await supabase
        .from("expense_category_types")
        .select("expense_type")
        .eq("category_id", categoryId)
        .eq("organization_id", organization.id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Return just the names in a string array
        return data.map(item => item.expense_type);
      }
      
      // If no direct types or mappings found, return all expense types
      const { data: typeData, error: typeError } = await supabase
        .from("expense_types")
        .select("name")
        .eq("organization_id", organization.id);
      
      if (typeError) throw typeError;
      
      return typeData ? typeData.map(type => type.name) : [];
      
    } catch (error) {
      console.error("Error getting expense types for category:", error);
      return [];
    }
  };

  return {
    loading,
    expenseTypes,
    categoryMappings,
    fetchExpenseTypes,
    fetchCategoryMappings,
    createExpenseType,
    updateExpenseType,
    deleteExpenseType,
    saveCategoryTypeMappings,
    fetchExpenseTypesForCategory // Return the renamed function
  };
};
