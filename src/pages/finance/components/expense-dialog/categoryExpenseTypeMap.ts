
// Cache for storing expense type mapping by category
let expenseTypeCache: Record<string, string[]> = {};

// Function to get expense types for a category
export const getExpenseTypesForCategory = (categoryId: string): string[] => {
  return expenseTypeCache[categoryId] || [];
};

// Function to set expense types for a category
export const setExpenseTypesForCategory = (categoryId: string, types: string[]): void => {
  expenseTypeCache[categoryId] = types;
};

// Function to clear the cache
export const clearExpenseTypeCache = (): void => {
  expenseTypeCache = {};
};
