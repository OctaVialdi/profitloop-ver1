
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecurringExpense } from "../types/expense";
import { Skeleton } from "@/components/ui/skeleton";

interface RecurringExpensesSectionProps {
  loading: boolean;
  recurringExpenses: RecurringExpense[];
}

export function RecurringExpensesSection({ 
  loading, 
  recurringExpenses 
}: RecurringExpensesSectionProps) {
  
  // Format currency display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="shadow-md border">
      <CardHeader>
        <CardTitle className="text-xl">Recurring Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          // Show loading skeletons
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-3 w-[200px]" />
                </div>
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        ) : recurringExpenses.length > 0 ? (
          <div className="space-y-4">
            {recurringExpenses.map((expense) => (
              <div 
                key={expense.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div>
                  <h4 className="font-medium">{expense.title}</h4>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>{expense.category}</span>
                    <span>•</span>
                    <span>{expense.frequency}</span>
                  </div>
                </div>
                <div className="font-semibold">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No recurring expenses found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
