
import React from "react";
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
import { BadgePercent, X } from "lucide-react";

interface DiscountOfferDialogProps {
  isOpen: boolean;
  onBack: () => void;
  onContinueToCancel: () => void;
  onClaimOffer: () => void;
  planName: string;
  onClose: () => void;
}

export function DiscountOfferDialog({
  isOpen,
  onBack,
  onContinueToCancel,
  onClaimOffer,
  planName,
  onClose
}: DiscountOfferDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogClose asChild onClick={onClose} className="absolute right-4 top-4">
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
        
        <DialogHeader>
          <DialogTitle>Wait! We have a special offer for you</DialogTitle>
          <DialogDescription>
            Before you cancel your {planName} subscription, we'd like to offer you a discount.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
            <BadgePercent className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div className="text-blue-800">
              <h4 className="font-semibold text-lg">Get 30% off for 3 months</h4>
              <p className="text-sm mt-1">
                We value your business and would like to offer you a 30% discount on your subscription for the next 3 months.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onBack}>
            Go Back
          </Button>
          <Button variant="ghost" onClick={onContinueToCancel}>
            No thanks, continue cancelling
          </Button>
          <Button onClick={onClaimOffer} className="bg-green-600 hover:bg-green-700">
            Claim Discount
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
