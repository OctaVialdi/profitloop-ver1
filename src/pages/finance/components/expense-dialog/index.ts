
// Fix imports to use named imports instead of default imports
import { DateAmountSection } from './DateAmountSection';
import { CategorySection } from './CategorySection';
import { DescriptionSection } from './DescriptionSection';
import DepartmentTypeSection from './DepartmentTypeSection';
import { RecurringSection } from './RecurringSection';
import { ReceiptUploadSection } from './ReceiptUploadSection';
import { clearExpenseTypeCache } from './categoryExpenseTypeMap';
import EditExpenseDialog from './EditExpenseDialog';

// Create and export DialogFooter component
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const DialogFooter: React.FC<{
  isSubmitting: boolean;
  onSubmit: () => void;
  label?: string;
}> = ({ isSubmitting, onSubmit, label = "Add Expense" }) => {
  return (
    <div className="px-6 py-4 border-t bg-background sticky bottom-0 flex justify-end">
      <Button 
        className="bg-[#8B5CF6] hover:bg-[#7c4ff1]" 
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>{label}</>
        )}
      </Button>
    </div>
  );
};

export {
  DateAmountSection,
  CategorySection,
  DescriptionSection,
  DepartmentTypeSection,
  RecurringSection,
  ReceiptUploadSection,
  clearExpenseTypeCache,
  EditExpenseDialog
};
