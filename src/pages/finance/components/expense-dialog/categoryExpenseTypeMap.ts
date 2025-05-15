
// Configuration mapping categories to their allowed expense types
export const categoryExpenseTypeMap: Record<string, string[]> = {
  // Default categories and their allowed expense types
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

// A function to get allowed expense types for a category
export const getAllowedExpenseTypes = (category: string): string[] => {
  return categoryExpenseTypeMap[category] || ["Fixed", "Variable", "Operational", "Capital", "Non-Operational"];
};
