
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FormStep } from "./FormSteps";

interface StepNavigationProps {
  currentStep: FormStep;
  handlePreviousStep: () => void;
  handleNextStep: () => void;
  handleSubmit?: () => void;
  isSubmitting?: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  handlePreviousStep,
  handleNextStep,
  handleSubmit,
  isSubmitting = false,
}) => {
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
        <Button onClick={handleSubmit} disabled={isSubmitting}>
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
