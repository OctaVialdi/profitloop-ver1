
import { useState } from "react";
import { Expense } from "@/hooks/useExpenses";

export function useExpenseFilters(expenses: Expense[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Get unique departments from expenses
  const uniqueDepartments = [...new Set(expenses.map(expense => expense.department).filter(Boolean))]
    .sort();

  // Get unique expense types from expenses
  const uniqueExpenseTypes = [...new Set(expenses.map(expense => expense.expense_type).filter(Boolean))]
    .sort();

  // Apply filters to expenses
  const filteredExpenses = expenses.filter(expense => {
    // Apply search term filter
    const matchesSearch = searchTerm === "" || 
      (expense.description && expense.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm);

    // Apply date filter
    const matchesDate = dateFilter === null || 
      new Date(expense.date).setHours(0, 0, 0, 0) === new Date(dateFilter).setHours(0, 0, 0, 0);

    // Apply department filter
    const matchesDepartment = departmentFilter === "all" || expense.department === departmentFilter;

    // Apply type filter
    const matchesType = typeFilter === "all" || expense.expense_type === typeFilter;

    // Return true only if all filters match
    return matchesSearch && matchesDate && matchesDepartment && matchesType;
  });

  return {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    departmentFilter,
    setDepartmentFilter,
    typeFilter,
    setTypeFilter,
    filteredExpenses,
    uniqueDepartments,
    uniqueExpenseTypes
  };
}
