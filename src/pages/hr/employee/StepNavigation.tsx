
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FormStep } from "./FormSteps";
import { toast } from "@/components/ui/sonner";

interface StepNavigationProps {
  currentStep: FormStep;
  handlePreviousStep: () => void;
  handleNextStep: () => void;
  handleSubmit?: () => Promise<string | null>;
  isSubmitting?: boolean;
  validationErrors?: string[];
  handleCancel?: () => void; // Added for single-page form
  handleSaveEmployee?: () => void; // Added for single-page form
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  handlePreviousStep,
  handleNextStep,
  handleSubmit,
  isSubmitting = false,
  validationErrors = [],
  handleCancel,
  handleSaveEmployee
}) => {
  const onSubmitClick = async () => {
    if (!handleSubmit) return;
    
    // Show validation errors if any
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }
    
    try {
      const result = await handleSubmit();
      if (result) {
        toast.success("Employee data saved successfully");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to save employee data");
    }
  };

  // For simplified one-page form
  if (handleSaveEmployee) {
    return (
      <div className="flex justify-end gap-2 mt-8">
        {handleCancel && (
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSaveEmployee} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Employee"}
        </Button>
      </div>
    );
  }

  // For multi-step form (original)
  return (
    <div className="flex justify-end gap-2 mt-8">
      {currentStep > FormStep.PERSONAL_DATA && (
        <Button variant="outline" onClick={handlePreviousStep}>
          Back
        </Button>
      )}
      {currentStep === FormStep.PERSONAL_DATA && (
        <Button variant="outline" asChild>
          <Link to="/hr/data">Cancel</Link>
        </Button>
      )}
      {currentStep === FormStep.INVITE ? (
        <Button onClick={onSubmitClick} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      ) : (
        <Button onClick={handleNextStep}>
          Next
        </Button>
      )}
    </div>
  );
};
