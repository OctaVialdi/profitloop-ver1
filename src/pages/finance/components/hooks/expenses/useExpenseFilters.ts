
import { useState } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";

export function useExpenseFilters(expenses: Expense[], categories: ExpenseCategory[]) {
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all-time");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Apply filters when expenses, search term, or filters change
  const filterExpenses = () => {
    // Make sure expenses is not empty
    if (expenses.length === 0) {
      console.log("No expenses to filter");
      return [];
    }
    
    let result = [...expenses];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(expense => 
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categories.find(cat => cat.id === expense.category_id)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.expense_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter !== "all-time") {
      const now = new Date();
      let startDate = new Date();
      
      if (dateFilter === "this-month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (dateFilter === "last-month") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        result = result.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate && expenseDate <= endDate;
        });
      } else if (dateFilter === "this-year") {
        startDate = new Date(now.getFullYear(), 0, 1);
      }
      
      if (dateFilter !== "last-month") {
        result = result.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate;
        });
      }
    }
    
    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(expense => 
        expense.department?.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    
    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter(expense => 
        expense.expense_type?.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    return result;
  };

  // Get unique departments and expense types for filters
  const getUniqueFilters = () => {
    const uniqueDepartments = Array.from(
      new Set(expenses.map(e => e.department).filter(Boolean))
    ) as string[];
    
    const uniqueExpenseTypes = Array.from(
      new Set(expenses.map(e => e.expense_type).filter(Boolean))
    ) as string[];

    return {
      uniqueDepartments,
      uniqueExpenseTypes
    };
  };

  const { uniqueDepartments, uniqueExpenseTypes } = getUniqueFilters();
  const filteredExpenses = filterExpenses();

  return {
    filteredExpenses,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    departmentFilter,
    setDepartmentFilter,
    typeFilter,
    setTypeFilter,
    uniqueDepartments,
    uniqueExpenseTypes
  };
}
