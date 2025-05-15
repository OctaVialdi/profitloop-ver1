
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { useState } from "react";
import AddExpenseDialog from "../AddExpenseDialog";
import { useExpenses } from "@/hooks/useExpenses";

interface ExpenseHeaderProps {
  error: string | null;
  onRetry: () => void;
}

export const ExpenseHeader = ({ error, onRetry }: ExpenseHeaderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { categories, loadInitialData } = useExpenses();

  // Mock departments for demo
  const departments = ["Marketing", "IT", "Operations", "HR", "Finance", "Sales"];

  // Handle expense added
  const handleExpenseAdded = () => {
    loadInitialData();
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
        <p className="text-muted-foreground">
          Manage and track your organization's expenses
        </p>
        {error && (
          <div className="mt-2 text-red-500 flex items-center gap-2">
            <span>Error loading data: {error}</span>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCcw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        )}
      </div>
      
      <Button onClick={() => setDialogOpen(true)}>
        <Plus className="h-4 w-4 mr-2" /> Add Expense
      </Button>

      <AddExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onExpenseAdded={handleExpenseAdded}
        categories={categories}
        departments={departments}
      />
    </div>
  );
};
