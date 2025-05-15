
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseCategory, Expense } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";

interface ExpenseTableProps {
  loading: boolean;
  filteredExpenses: Expense[];
  categories: ExpenseCategory[];
  expenses: Expense[];
}

export function ExpenseTable({
  loading,
  filteredExpenses,
  categories,
}: ExpenseTableProps) {
  // Function to get payment status based on date
  const getPaymentStatus = (expense: Expense) => {
    const expenseDate = new Date(expense.date);
    const today = new Date();
    const daysDifference = differenceInDays(today, expenseDate);

    // If recurring, show recurring badge
    if (expense.is_recurring) {
      return {
        label: "Recurring",
        color: "bg-blue-100 text-blue-800",
      };
    }
    
    // Recent expense (within last 3 days)
    else if (daysDifference <= 3) {
      return {
        label: "Recent",
        color: "bg-green-100 text-green-800",
      };
    }
    
    // Older expense (4-14 days)
    else if (daysDifference <= 14) {
      return {
        label: "Processed",
        color: "bg-gray-100 text-gray-800",
      };
    }
    
    // Very old expense
    else {
      return {
        label: "Archived",
        color: "bg-purple-100 text-purple-800",
      };
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[180px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : filteredExpenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No expenses found.
              </TableCell>
            </TableRow>
          ) : (
            filteredExpenses.map((expense) => {
              const status = getPaymentStatus(expense);
              return (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{expense.description || "-"}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.department || "-"}</TableCell>
                  <TableCell>{expense.expense_type || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${status.color} border-0`}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatRupiah(expense.amount)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
