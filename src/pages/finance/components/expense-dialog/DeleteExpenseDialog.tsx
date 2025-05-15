
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatRupiah } from "@/utils/formatUtils";
import { Expense } from "@/hooks/useExpenses";

interface DeleteExpenseDialogProps {
  expense: Expense | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

export function DeleteExpenseDialog({
  expense,
  isOpen,
  onOpenChange,
  onConfirmDelete,
  isDeleting
}: DeleteExpenseDialogProps) {
  if (!expense) return null;

  // Format the date for display
  const formattedDate = new Date(expense.date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Confirm Delete Expense
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this expense?
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-gray-700">Date:</div>
                <div>{formattedDate}</div>
                
                <div className="font-medium text-gray-700">Amount:</div>
                <div className="font-semibold">{formatRupiah(expense.amount)}</div>
                
                <div className="font-medium text-gray-700">Category:</div>
                <div>{expense.category}</div>
                
                <div className="font-medium text-gray-700">Description:</div>
                <div className="col-span-2 italic text-gray-600">{expense.description || "No description provided"}</div>
              </div>
            </div>
            <p className="mt-4 text-destructive font-medium">This action cannot be undone.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Expense"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
