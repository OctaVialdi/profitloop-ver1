
import React from "react";
import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  label?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ 
  isSubmitting, 
  onSubmit,
  label = "Add Expense"
}) => {
  return (
    <div className="px-6 py-4 border-t mt-auto bg-background sticky bottom-0">
      <Button 
        className="w-full h-[50px] bg-[#8B5CF6] hover:bg-[#7c4ff1]" 
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? `${label === "Add Expense" ? "Adding..." : "Saving..."}` : label}
      </Button>
    </div>
  );
};
