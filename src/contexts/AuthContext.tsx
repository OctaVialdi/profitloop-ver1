
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from '@/hooks/auth/useAuth';

interface AuthContextType {
  isLoggedIn: boolean;
  user: any | null;
  session: any | null;
  signInWithEmailPassword: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  session: null,
  signInWithEmailPassword: async () => {},
  signOut: async () => {},
  isLoading: false,
  loginError: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthHook();
  
  const isLoggedIn = !!auth.user;
  
  return (
    <AuthContext.Provider 
      value={{
        ...auth,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
