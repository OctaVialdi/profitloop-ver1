
import { useState } from "react";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";

export function useExpenseFilters(expenses: Expense[], categories: ExpenseCategory[]) {
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
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
    if (dateFilter !== "all") {
      const now = new Date();
      
      switch(dateFilter) {
        case "today":
          const todayStart = startOfDay(now);
          const todayEnd = endOfDay(now);
          result = result.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= todayStart && expenseDate <= todayEnd;
          });
          break;
          
        case "this-week":
          const weekStart = startOfWeek(now);
          const weekEnd = endOfWeek(now);
          result = result.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= weekStart && expenseDate <= weekEnd;
          });
          break;
          
        case "this-month":
          const monthStart = startOfMonth(now);
          const monthEnd = endOfMonth(now);
          result = result.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= monthStart && expenseDate <= monthEnd;
          });
          break;
          
        case "last-month":
          const lastMonth = subMonths(now, 1);
          const lastMonthStart = startOfMonth(lastMonth);
          const lastMonthEnd = endOfMonth(lastMonth);
          result = result.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd;
          });
          break;
          
        case "last-3-months":
          const threeMonthsAgo = subMonths(now, 3);
          result = result.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= threeMonthsAgo;
          });
          break;
          
        case "this-year":
          const yearStart = startOfYear(now);
          result = result.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= yearStart;
          });
          break;
          
        // Custom range would be handled separately through a date picker component
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
