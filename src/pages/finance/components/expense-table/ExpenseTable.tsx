
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useExpensesContext } from "@/contexts/expenses";

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
  
  // State for details dialog
  const [detailsExpense, setDetailsExpense] = useState<Expense | null>(null);

  // State for delete confirmation
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get expense operations from context
  const { deleteExpense: deleteExpenseFunction } = useExpensesContext();

  // Helper to get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  // Handle View Receipt
  const handleViewReceipt = (expense: Expense) => {
    if (expense.receipt_url) {
      setReceiptUrl(expense.receipt_url);
    } else {
      toast({
        title: "No Receipt",
        description: "This expense does not have an attached receipt.",
        variant: "destructive",
      });
    }
  };

  // Handle View Details
  const handleViewDetails = (expense: Expense) => {
    setDetailsExpense(expense);
  };

  // Handle Edit
  const handleEdit = (expense: Expense) => {
    // For now we'll just show a toast as edit functionality would require a form
    toast({
      title: "Edit Expense",
      description: `Editing expense: ${expense.description || 'No description'} (${formatRupiah(expense.amount)})`,
    });
    // In a real implementation, we would open an edit form/dialog here
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deleteExpense) return;
    
    try {
      setIsDeleting(true);
      await deleteExpenseFunction(deleteExpense.id);
      
      toast({
        title: "Expense Deleted",
        description: "The expense has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteExpense(null);
    }
  };

  const closeReceiptDialog = () => setReceiptUrl(null);
  const closeDetailsDialog = () => setDetailsExpense(null);
  const closeDeleteDialog = () => setDeleteExpense(null);

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
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewReceipt(expense)}
                          disabled={!expense.receipt_url}
                          className="flex items-center cursor-pointer"
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          View Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleViewDetails(expense)}
                          className="flex items-center cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleEdit(expense)}
                          className="flex items-center cursor-pointer"
                        >
                          <FileEdit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteExpense(expense)}
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

      {/* Receipt Dialog */}
      <Dialog open={!!receiptUrl} onOpenChange={closeReceiptDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
            <DialogDescription>
              Expense receipt image
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-2">
            {receiptUrl && (
              <img 
                src={receiptUrl} 
                alt="Receipt" 
                className="max-w-full h-auto max-h-[70vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/400x600?text=Receipt+Not+Available";
                }} 
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeReceiptDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!detailsExpense} onOpenChange={closeDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>
              Complete information about this expense
            </DialogDescription>
          </DialogHeader>
          
          {detailsExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                  <p className="text-lg font-semibold">{formatRupiah(detailsExpense.amount)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date</h4>
                  <p>{new Date(detailsExpense.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                <p>{getCategoryName(detailsExpense.category_id)}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Department</h4>
                <p>{detailsExpense.department || "Not specified"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Expense Type</h4>
                <p>{detailsExpense.expense_type || "Regular"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="whitespace-pre-wrap">{detailsExpense.description || "No description provided"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Recurring</h4>
                <p>{detailsExpense.is_recurring ? `Yes (${detailsExpense.recurring_frequency || "unspecified frequency"})` : "No"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Created</h4>
                <p>{new Date(detailsExpense.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDetailsDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteExpense} onOpenChange={closeDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deleteExpense && (
            <div className="py-4">
              <p><strong>Amount:</strong> {formatRupiah(deleteExpense.amount)}</p>
              <p><strong>Date:</strong> {new Date(deleteExpense.date).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {deleteExpense.description || "No description"}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog} disabled={isDeleting}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
