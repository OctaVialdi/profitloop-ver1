
import { useContext } from 'react';
import { ExpensesContext } from './ExpensesContext';

export const useExpensesContext = () => {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpensesContext must be used within an ExpensesProvider');
  }
  return context;
};
