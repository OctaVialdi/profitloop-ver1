
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuthState } from '@/hooks/useAuthState';
import { Loader2 } from 'lucide-react';

interface AuthCheckProps {
  children: ReactNode;
}

export const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuthState();
  const { organization, isLoading: orgLoading } = useOrganization();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    if (!authLoading && !orgLoading) {
      setCheckedAuth(true);
    }
  }, [authLoading, orgLoading]);

  if (!checkedAuth) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Verifying account...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has an organization
  if (!organization) {
    return (
      <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization Not Found</h2>
        <p className="text-gray-600 mb-6">
          Your account doesn't seem to be associated with any organization yet. You need to set up or join an organization to access this feature.
        </p>
        <div className="flex space-x-4">
          <a 
            href="/organizations" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Set Up Organization
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
