
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ExpenseDetailDialog } from "../expense-details/ExpenseDetailDialog";
import { EditExpenseDialog } from "../expense-dialog";
import { DeleteExpenseDialog } from "../expense-dialog/DeleteExpenseDialog";

interface ExpenseTableProps {
  loading: boolean;
  filteredExpenses: Expense[];
  categories: ExpenseCategory[];
  expenses: Expense[];
  onRefreshData?: () => void;
}

export function ExpenseTable({
  loading,
  filteredExpenses,
  categories,
  expenses,
  onRefreshData,
}: ExpenseTableProps) {
  // State for viewing receipt
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  
  // State for expense details
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // State for edit expense
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // State for delete expense
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  // Function to handle viewing receipt
  const handleViewReceipt = (url: string | undefined) => {
    if (url) {
      setReceiptUrl(url);
      setIsReceiptOpen(true);
    }
  };
  
  // Function to handle viewing expense details
  const handleViewDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDetailOpen(true);
  };
  
  // Function to handle editing expense
  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditOpen(true);
  };
  
  // Function to handle deleting expense
  const handleDeleteExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteOpen(true);
  };

  // Function to handle successful edit
  const handleEditSuccess = () => {
    if (onRefreshData) {
      onRefreshData();
    }
  };
  
  // Function to handle confirming delete
  const handleConfirmDelete = async () => {
    if (!selectedExpense) return;
    
    setIsDeleting(true);
    try {
      // Import the useExpenses hook within the component to use its deleteExpense method
      const { deleteExpense } = require('@/hooks/useExpenses').useExpenses();
      await deleteExpense(selectedExpense.id);
      setIsDeleteOpen(false);
      
      if (onRefreshData) {
        onRefreshData();
      }
    } finally {
      setIsDeleting(false);
    }
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
              <TableHead className="text-gray-600 font-medium text-right">Amount</TableHead>
              <TableHead className="text-gray-600 font-medium min-w-[300px] w-1/3">Description</TableHead>
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
                  <TableCell className={`text-right font-medium`}>
                    {formatRupiah(expense.amount)}
                  </TableCell>
                  <TableCell className="min-w-[300px] w-1/3">{expense.description || "N/A"}</TableCell>
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
                      <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg rounded-md overflow-hidden">
                        <DropdownMenuLabel className="font-semibold text-gray-700 px-4 py-2 border-b">Actions</DropdownMenuLabel>
                        
                        <div className="py-1">
                          <DropdownMenuItem
                            onClick={() => handleViewReceipt(expense.receipt_url)}
                            disabled={!expense.receipt_url}
                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer gap-2"
                          >
                            <Receipt className="h-4 w-4 text-gray-500" />
                            <span>View Receipt</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleViewDetails(expense)}
                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer gap-2"
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                            <span>Details</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleEditExpense(expense)}
                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer gap-2"
                          >
                            <FileEdit className="h-4 w-4 text-amber-500" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                        </div>
                        
                        <DropdownMenuSeparator className="my-1 border-t" />
                        
                        <div className="py-1">
                          <DropdownMenuItem
                            onClick={() => handleDeleteExpense(expense)}
                            className="flex items-center px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white">
          <DialogHeader>
            <DialogTitle>Expense Receipt</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            {receiptUrl ? (
              <div className="max-h-[70vh] overflow-auto">
                {receiptUrl.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={receiptUrl}
                    className="w-full h-[60vh]"
                    title="Expense receipt"
                  />
                ) : (
                  <img
                    src={receiptUrl}
                    alt="Expense receipt"
                    className="max-w-full object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <p>No receipt available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Expense Detail Dialog */}
      <ExpenseDetailDialog 
        expense={selectedExpense}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        categories={categories}
      />
      
      {/* Edit Expense Dialog */}
      <EditExpenseDialog 
        expense={selectedExpense}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={handleEditSuccess}
      />
      
      {/* Delete Expense Dialog */}
      <DeleteExpenseDialog
        expense={selectedExpense}
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
