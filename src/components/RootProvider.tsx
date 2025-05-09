
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

interface RootProviderProps {
  children: ReactNode;
}

/**
 * Provides the basic router context for the application
 */
export function RootProvider({ children }: RootProviderProps) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
