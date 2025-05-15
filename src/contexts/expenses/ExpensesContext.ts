
import { createContext } from 'react';
import { ExpensesContextType } from './types';

export const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);
