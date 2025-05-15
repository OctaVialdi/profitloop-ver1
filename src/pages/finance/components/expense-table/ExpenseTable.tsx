
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { formatRupiah } from "@/utils/formatUtils";
import {
  MoreHorizontal,
  Receipt,
  Eye,
  FileEdit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  // State for viewing receipt
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  // Helper to get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-gray-500">No expenses found.</p>
          <p className="text-gray-400 text-sm max-w-md">
            Try adjusting your filters or add new expenses to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md max-h-[600px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-600 font-medium">Date</TableHead>
              <TableHead className="text-gray-600 font-medium">Category</TableHead>
              <TableHead className="text-gray-600 font-medium">Department</TableHead>
              <TableHead className="text-gray-600 font-medium">Type</TableHead>
              <TableHead className="text-gray-600 font-medium min-w-[250px] w-1/3">Description</TableHead>
              <TableHead className="text-gray-600 font-medium text-right">Amount</TableHead>
              <TableHead className="text-gray-600 font-medium text-center">Status</TableHead>
              <TableHead className="text-gray-600 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => {
              const categoryName = getCategoryName(expense.category_id);
              const formattedDate = new Date(expense.date).toLocaleDateString(
                "id-ID",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              );

              // For demo purposes, let's assume some expenses are recurring and some are approved
              const isRecurring = expense.is_recurring;
              
              return (
                <TableRow key={expense.id} className="border-b hover:bg-gray-50">
                  <TableCell className="font-medium">{formattedDate}</TableCell>
                  <TableCell>{categoryName}</TableCell>
                  <TableCell>{expense.department || "N/A"}</TableCell>
                  <TableCell>{expense.expense_type || "Regular"}</TableCell>
                  <TableCell className="min-w-[250px] w-1/3">{expense.description || "N/A"}</TableCell>
                  <TableCell className={`text-right font-medium`}>
                    {formatRupiah(expense.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={isRecurring ? "outline" : "ghost"}
                          size="sm"
                          className={`h-8 px-2 ${isRecurring ? "border-blue-400 text-blue-600" : "text-gray-600"}`}
                        >
                          {isRecurring ? "Recurring" : "One-time"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-1">
                        <div className="grid gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex justify-start items-center"
                          >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Approved
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex justify-start items-center"
                          >
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Rejected
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            if (expense.receipt_url) {
                              setReceiptUrl(expense.receipt_url);
                            }
                          }}
                          disabled={!expense.receipt_url}
                          className="flex items-center cursor-pointer"
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          View Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center cursor-pointer">
                          <FileEdit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center text-red-600 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Receipt modal would go here */}
    </>
  );
}
