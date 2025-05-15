
import React, { useEffect, useState } from 'react';
import { ExpensesContext } from './ExpensesContext';
import { useExpenses } from '@/hooks/useExpenses';

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const {
    loading,
    error,
    categories,
    expenses,
    fetchCategories,
    fetchExpenses,
    loadInitialData,
    addCategory,
    addExpense,
    deleteExpense,
  } = useExpenses();

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const contextValue = {
    loading,
    error,
    categories,
    expenses,
    fetchCategories,
    fetchExpenses,
    refreshData: loadInitialData,
    addCategory,
    addExpense,
    deleteExpense,
  };

  return (
    <ExpensesContext.Provider value={contextValue}>
      {children}
    </ExpensesContext.Provider>
  );
};
