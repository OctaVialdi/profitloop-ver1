
import React from "react";
import { formatRupiah } from "@/utils/formatUtils";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CalendarIcon, Building2, Receipt, FileText, Wallet, CreditCard, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ExpenseDetailDialogProps {
  expense: Expense | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ExpenseCategory[];
}

export function ExpenseDetailDialog({
  expense,
  isOpen,
  onOpenChange,
  categories,
}: ExpenseDetailDialogProps) {
  if (!expense) return null;
  
  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };
  
  const formattedDate = expense.date 
    ? format(new Date(expense.date), "dd MMMM yyyy")
    : "N/A";
    
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 border-b bg-gray-50">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Expense Detail
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Amount - Make this prominent */}
          <div className="bg-primary/5 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-gray-600">Amount</span>
            </div>
            <div className="text-xl font-bold text-primary">
              {formatRupiah(expense.amount)}
            </div>
          </div>
          
          {/* Key details in a grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Date
              </div>
              <div className="font-medium">{formattedDate}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                Category
              </div>
              <div className="font-medium">{getCategoryName(expense.category_id)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                Department
              </div>
              <div className="font-medium">{expense.department || "N/A"}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Type
              </div>
              <div className="font-medium">{expense.expense_type || "Regular"}</div>
            </div>
          </div>
          
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={expense.is_recurring ? "outline" : "secondary"} className="flex items-center gap-1">
              {expense.is_recurring ? (
                <>
                  <RotateCcw className="h-3 w-3" />
                  Recurring
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3" />
                  One-time
                </>
              )}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Approved
            </Badge>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="text-sm text-gray-500 font-medium">Description</div>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              {expense.description || "No description provided"}
            </div>
          </div>
          
          {/* Receipt information */}
          {expense.receipt_url && (
            <div className="space-y-2">
              <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <Receipt className="h-4 w-4" />
                Receipt
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <a
                  href={expense.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary flex items-center gap-1 text-sm hover:underline"
                >
                  <Receipt className="h-4 w-4" />
                  View Receipt
                </a>
              </div>
            </div>
          )}
          
          {/* Additional metadata - Created at */}
          <div className="pt-3 border-t mt-4">
            <div className="text-xs text-gray-400 italic">
              Created on {expense.created_at ? format(new Date(expense.created_at), "dd MMM yyyy, HH:mm") : "N/A"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
