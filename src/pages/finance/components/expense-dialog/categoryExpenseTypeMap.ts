
import { supabase } from "@/integrations/supabase/client";

// Default configuration mapping categories to their allowed expense types
export const defaultCategoryExpenseTypeMap: Record<string, string[]> = {
  "Office Supplies": ["Fixed", "Operational", "Variable"],
  "Travel": ["Variable", "Operational"],
  "Utilities": ["Fixed", "Operational"],
  "Equipment": ["Capital", "Fixed"],
  "Marketing": ["Variable", "Operational"],
  "Salaries": ["Fixed", "Operational"],
  "Rent": ["Fixed"],
  "Software": ["Operational", "Fixed"],
  "Maintenance": ["Variable", "Operational"],
  "Insurance": ["Fixed"],
  "Training": ["Variable", "Operational"],
  "Consulting": ["Variable", "Non-Operational"],
  "Taxes": ["Fixed", "Non-Operational"],
  "Miscellaneous": ["Variable", "Operational", "Non-Operational"],
};

// Cached mapping to reduce database calls
let cachedMappings: Record<string, string[]> = {};
let cachedOrganizationId: string | null = null;

// A function to get allowed expense types for a category
export const getAllowedExpenseTypes = async (category: string, categoryId: string, organizationId: string): Promise<string[]> => {
  // If we have a cached mapping for this organization, use it
  if (cachedOrganizationId === organizationId && cachedMappings[categoryId]) {
    return cachedMappings[categoryId];
  }
  
  try {
    // If no category ID or organization ID, use default
    if (!categoryId || !organizationId) {
      return defaultCategoryExpenseTypeMap[category] || ["Fixed", "Variable", "Operational", "Capital", "Non-Operational"];
    }
    
    // Check for custom mappings in the database
    const { data, error } = await supabase
      .from("expense_category_types")
      .select("expense_type")
      .eq("category_id", categoryId)
      .eq("organization_id", organizationId);
      
    if (error || !data || data.length === 0) {
      // If no mappings or error, use default
      const defaultTypes = defaultCategoryExpenseTypeMap[category] || ["Fixed", "Variable", "Operational", "Capital", "Non-Operational"];
      console.log(`No custom mappings found for category "${category}", using defaults:`, defaultTypes);
      return defaultTypes;
    }
    
    // Update cache
    cachedOrganizationId = organizationId;
    const expenseTypes = data.map(item => item.expense_type);
    cachedMappings[categoryId] = expenseTypes;
    
    console.log(`Found custom mappings for category "${category}":`, expenseTypes);
    return expenseTypes;
  } catch (error) {
    console.error(`Error getting expense types for category "${category}":`, error);
    return defaultCategoryExpenseTypeMap[category] || ["Fixed", "Variable", "Operational", "Capital", "Non-Operational"];
  }
};

// Function to get expense type options synchronously (for initial render)
export const getInitialExpenseTypes = (category: string): string[] => {
  return defaultCategoryExpenseTypeMap[category] || ["Fixed", "Variable", "Operational", "Capital", "Non-Operational"];
};

// Clear the cache when needed (after updates)
export const clearExpenseTypeCache = () => {
  console.log("Clearing expense type cache");
  cachedMappings = {};
  cachedOrganizationId = null;
};
