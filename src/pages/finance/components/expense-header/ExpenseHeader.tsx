
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import AddExpenseDialog from "../AddExpenseDialog";

interface ExpenseHeaderProps {
  error: string | null;
  onRetry: () => Promise<void>;
}

export function ExpenseHeader({ error, onRetry }: ExpenseHeaderProps) {
  return (
    <>
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Expenses</h2>
          <p className="text-muted-foreground">
            Manage and track your organization's expenses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <AddExpenseDialog />
        </div>
      </div>

      {/* Error message display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-800">Error loading expenses</h4>
                <p className="text-sm text-red-600">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => onRetry()}
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
