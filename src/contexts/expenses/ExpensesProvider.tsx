
import React, { useEffect, useState, useCallback } from 'react';
import { ExpensesContext } from './ExpensesContext';
import { useExpenses } from '@/hooks/useExpenses';
import { useOrganization } from '@/hooks/useOrganization';
import { toast } from "@/hooks/use-toast";

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { organization, isLoading: orgLoading } = useOrganization();
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null);
  
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

  // Clear any existing retry timeout when component unmounts
  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryTimeout]);

  // Load data when organization is available with automatic retry
  const initializeData = useCallback(async () => {
    if (!organization?.id && !orgLoading) {
      console.warn("No organization ID found. User might need to set up an organization first.");
      return;
    }

    if (organization?.id && !isInitialized) {
      console.log("Organization ID found, loading expense data:", organization.id);
      try {
        await loadInitialData();
        setIsInitialized(true);
        setRetryAttempts(0); // Reset retry attempts on success
      } catch (err) {
        console.error("Failed to load initial expense data:", err);
        
        // Only show toast on first error
        if (retryAttempts === 0) {
          toast.error("Failed to load expense data. Retrying automatically...");
        }
        
        // Auto-retry with increasing backoff (max 3 attempts)
        if (retryAttempts < 3) {
          const nextRetryDelay = Math.min(1000 * Math.pow(2, retryAttempts), 5000);
          console.log(`Scheduling retry attempt ${retryAttempts + 1} in ${nextRetryDelay}ms`);
          
          const timeout = setTimeout(() => {
            setRetryAttempts(prev => prev + 1);
            initializeData();
          }, nextRetryDelay);
          
          setRetryTimeout(timeout);
        } else {
          toast.error("Failed to load expense data after multiple attempts. Please try again manually.");
        }
      }
    }
  }, [organization?.id, orgLoading, isInitialized, loadInitialData, retryAttempts]);

  useEffect(() => {
    initializeData();
  }, [initializeData, organization?.id, orgLoading]);

  // Manual refresh function that resets the retry state
  const refreshData = useCallback(async () => {
    setRetryAttempts(0);
    setIsInitialized(false);
    
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      setRetryTimeout(null);
    }
    
    return initializeData();
  }, [initializeData, retryTimeout]);

  const isLoadingData = loading || orgLoading || (retryAttempts > 0 && !isInitialized);

  const contextValue = {
    loading: isLoadingData,
    error: error && retryAttempts >= 3 ? error : null, // Only show error after retry attempts exhausted
    categories,
    expenses,
    fetchCategories,
    fetchExpenses,
    refreshData,
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
