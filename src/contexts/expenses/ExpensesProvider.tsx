
import React, { useEffect, useState } from 'react';
import { ExpensesContext } from './ExpensesContext';
import { useExpenses } from '@/hooks/useExpenses';
import { useOrganization } from '@/hooks/useOrganization';
import { toast } from "@/components/ui/sonner";

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { organization, isLoading: orgLoading } = useOrganization();
  const [isInitialized, setIsInitialized] = useState(false);
  
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

  // Load data when organization is available
  useEffect(() => {
    const initializeData = async () => {
      if (organization?.id && !isInitialized) {
        console.log("Organization ID found, loading expense data:", organization.id);
        try {
          await loadInitialData();
          setIsInitialized(true);
        } catch (err) {
          console.error("Failed to load initial expense data:", err);
          toast.error("Failed to load expense data. Please try again.");
        }
      } else if (!organization?.id && !orgLoading) {
        console.warn("No organization ID found. User might need to set up an organization first.");
      }
    };
    
    initializeData();
  }, [organization?.id, orgLoading, isInitialized]);

  const contextValue = {
    loading: loading || orgLoading,
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
