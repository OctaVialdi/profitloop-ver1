
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CancellationFeedbackDialog } from "./CancellationFeedbackDialog";
import { DiscountOfferDialog } from "./DiscountOfferDialog";
import { AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

const CANCELLATION_REASONS = [
  { id: "too_expensive", label: "It's too expensive" },
  { id: "missing_features", label: "Missing features I need" },
  { id: "not_using", label: "I'm not using it enough" },
  { id: "technical_issues", label: "Technical issues/bugs" },
  { id: "switched_product", label: "Switched to another product" },
  { id: "other", label: "Other reason" },
];

interface CancelPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string) => Promise<void>;
  planName: string;
  isTrialActive?: boolean;
  daysLeftInTrial?: number;
}

export function CancelPlanDialog({ 
  isOpen, 
  onClose, 
  onConfirmCancel, 
  planName, 
  isTrialActive = false,
  daysLeftInTrial = 0 
}: CancelPlanDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState("reason"); // "reason", "feedback", "offer", "confirm"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReasonNext = () => {
    if (!selectedReason) {
      toast.error("Please select a reason for cancellation");
      return;
    }

    // Clear any previous errors
    setErrorMessage(null);

    // If the reason is "too expensive", show the offer dialog
    if (selectedReason === "too_expensive") {
      setCurrentStep("offer");
    } else {
      // Otherwise, go to the feedback dialog
      setCurrentStep("feedback");
    }
  };

  const handleBackToReason = () => {
    setCurrentStep("reason");
    setErrorMessage(null);
  };

  const handleConfirmCancel = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      
      // Call the parent handler with the reason
      await onConfirmCancel(selectedReason || "not_specified");
      toast.success("Your subscription has been cancelled");
      onClose();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Failed to cancel subscription: ${errorMsg}. Please try again or contact support.`);
      toast.error("Failed to cancel subscription. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOfferClaimed = () => {
    // Handle offer claimed
    toast.success("Discount offer applied to your account!");
    onClose();
  };

  const handleFeedbackSubmitted = (feedbackText: string) => {
    setFeedback(feedbackText);
    setCurrentStep("confirm");
  };

  const resetDialog = () => {
    setCurrentStep("reason");
    setSelectedReason(null);
    setFeedback("");
    setIsSubmitting(false);
    setErrorMessage(null);
  };

  // Get the appropriate warning message based on trial status
  const getWarningMessage = () => {
    if (isTrialActive && daysLeftInTrial > 0) {
      return `Your subscription will be cancelled, but you can continue using premium features until your trial ends in ${daysLeftInTrial} day${daysLeftInTrial !== 1 ? 's' : ''}.`;
    }
    return "Your subscription will be cancelled immediately and you will lose access to premium features.";
  };

  return (
    <>
      <Dialog open={isOpen && currentStep === "reason"} onOpenChange={isOpen ? undefined : resetDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogClose asChild onClick={onClose} className="absolute right-4 top-4">
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          <DialogHeader>
            <DialogTitle>Cancel your subscription</DialogTitle>
            <DialogDescription>
              We're sorry to see you go. Please let us know why you're cancelling your {planName} plan.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup value={selectedReason || ""} onValueChange={setSelectedReason}>
              {CANCELLATION_REASONS.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value={reason.id} id={reason.id} />
                  <Label htmlFor={reason.id} className="cursor-pointer">{reason.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleReasonNext}>Next</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CancellationFeedbackDialog
        isOpen={isOpen && currentStep === "feedback"}
        onBack={handleBackToReason}
        onSubmit={handleFeedbackSubmitted}
        onClose={onClose}
      />

      <DiscountOfferDialog
        isOpen={isOpen && currentStep === "offer"}
        onBack={handleBackToReason}
        onContinueToCancel={() => setCurrentStep("feedback")}
        onClaimOffer={handleOfferClaimed}
        planName={planName}
        onClose={onClose}
      />

      <Dialog open={isOpen && currentStep === "confirm"} onOpenChange={isOpen ? undefined : resetDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogClose asChild onClick={onClose} className="absolute right-4 top-4">
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your {planName} subscription?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="flex items-start space-x-2 p-3 bg-amber-50 text-amber-800 rounded-md">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Important:</p>
                <p>{getWarningMessage()}</p>
              </div>
            </div>

            {feedback && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Your feedback:</p>
                <p className="italic">"{feedback}"</p>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-800 rounded-md">
                <p className="font-medium">Error:</p>
                <p>{errorMessage}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Go Back
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmCancel}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
