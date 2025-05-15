
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RecurringExpense {
  title: string;
  amount: string;
  category: string;
  date: string;
  frequency: string;
  isPaid: boolean;
}

interface RecurringExpensesSectionProps {
  loading: boolean;
  recurringExpenses: RecurringExpense[];
}

export function RecurringExpensesSection({
  loading,
  recurringExpenses,
}: RecurringExpensesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Recurring Expenses</h3>
        <Button variant="outline" size="sm" className="text-blue-600">
          View All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <Card className="overflow-hidden p-5">
            <p>Loading recurring expenses...</p>
          </Card>
        ) : recurringExpenses.length === 0 ? (
          <Card className="overflow-hidden p-5 col-span-full">
            <p className="text-center text-gray-500">No recurring expenses found. Add a recurring expense to see it here.</p>
          </Card>
        ) : (
          recurringExpenses.map((expense, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-200">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{expense.title}</p>
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                      {expense.frequency}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{expense.amount}</h3>
                  <p className="text-xs text-muted-foreground">{expense.category}</p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-200 mr-1"></span> {expense.date}
                  </p>
                  <Button 
                    variant={expense.isPaid ? "secondary" : "outline"} 
                    className={`w-full ${expense.isPaid ? 'bg-green-50 text-green-600 hover:bg-green-100' : ''}`}
                    size="sm"
                  >
                    {expense.isPaid ? '✓ Mark Paid' : 'Mark Paid'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
