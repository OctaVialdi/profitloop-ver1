
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/utils/formatUtils";

export interface RecurringExpense {
  title: string;
  amount: string | number;
  category: string;
  description?: string;
  date: string;
  frequency: string;
  isPaid: boolean;
  id: string;
}

interface RecurringExpensesSectionProps {
  recurringExpenses: RecurringExpense[];
  loading?: boolean;
}

export function RecurringExpensesSection({
  recurringExpenses,
  loading = false,
}: RecurringExpensesSectionProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recurring Expenses</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recurring Expenses</h2>
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </div>

      {recurringExpenses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recurringExpenses.map((expense) => (
            <Card key={expense.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{expense.title}</p>
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                      {expense.frequency}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">
                    {typeof expense.amount === 'number' 
                      ? formatRupiah(expense.amount)
                      : expense.amount}
                  </h3>
                  <p className="text-xs text-muted-foreground">{expense.description || expense.category}</p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-200 mr-1"></span> {expense.date}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p>No recurring expenses found</p>
            <Button variant="outline" size="sm" className="mt-4">
              Add Recurring Expense
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
