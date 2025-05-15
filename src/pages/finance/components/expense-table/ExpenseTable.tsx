
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/utils/formatUtils";
import { format } from "date-fns";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";

interface ExpenseTableProps {
  loading: boolean;
  filteredExpenses: Expense[];
  categories: ExpenseCategory[];
  expenses: Expense[];
}

export function ExpenseTable({ loading, filteredExpenses }: ExpenseTableProps) {
  // Get expense priority based on amount
  const getExpensePriority = (amount: number): "low" | "medium" | "high" => {
    if (amount > 5000000) return "high";
    if (amount > 1000000) return "medium";
    return "low";
  };

  // Get badge variant based on priority
  const getPriorityBadge = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No expenses found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Department</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Priority</TableHead> {/* Changed from Status to Priority */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredExpenses.map((expense) => {
          // Calculate priority based on amount
          const priority = getExpensePriority(Number(expense.amount));
          
          return (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">
                {format(new Date(expense.date), "MMM dd")}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {expense.description || "-"}
              </TableCell>
              <TableCell>{expense.category || "-"}</TableCell>
              <TableCell>{expense.department || "-"}</TableCell>
              <TableCell className="text-right font-medium">
                {formatRupiah(expense.amount)}
              </TableCell>
              <TableCell>
                {getPriorityBadge(priority)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
