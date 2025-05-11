
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CancellationFeedbackDialogProps {
  isOpen: boolean;
  onBack: () => void;
  onSubmit: (feedback: string) => void;
}

export function CancellationFeedbackDialog({
  isOpen,
  onBack,
  onSubmit,
}: CancellationFeedbackDialogProps) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit(feedback);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share your feedback</DialogTitle>
          <DialogDescription>
            We value your feedback. Please let us know how we can improve our service.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="Tell us what we could do better..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
            className="w-full"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleSubmit}>
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
