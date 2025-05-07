
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EvaluationCriterion } from "@/services/candidateService";

interface DeleteCriterionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criterion: EvaluationCriterion;
  onDelete: (id: string) => void;
}

export default function DeleteCriterionDialog({
  open,
  onOpenChange,
  criterion,
  onDelete
}: DeleteCriterionDialogProps) {
  const handleDelete = () => {
    onDelete(criterion.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Evaluation Criterion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this criterion? This action cannot be undone.
            <div className="mt-2 p-2 border rounded bg-muted">
              <strong>Question:</strong> {criterion.question}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
