
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";

interface ExpenseHeaderProps {
  error: string | null;
  loading?: boolean;
  onRetry: () => Promise<void>;
}

export const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({ 
  error, 
  loading = false, 
  onRetry 
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>
      
      {loading && !error && (
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <p>Loading expense data...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-destructive/15 p-4 rounded-md border border-destructive text-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-destructive font-medium">{error}</p>
            <Button 
              variant="outline" 
              onClick={onRetry}
              className="text-sm"
              disabled={loading}
            >
              {loading && <RefreshCw className="h-3 w-3 mr-2 animate-spin" />}
              Retry Loading
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
