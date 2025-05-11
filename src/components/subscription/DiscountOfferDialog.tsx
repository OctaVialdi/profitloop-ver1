
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, PercentIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DiscountOfferDialogProps {
  isOpen: boolean;
  onBack: () => void;
  onContinueToCancel: () => void;
  onClaimOffer: () => void;
  planName: string;
}

export function DiscountOfferDialog({
  isOpen,
  onBack,
  onContinueToCancel,
  onClaimOffer,
  planName,
}: DiscountOfferDialogProps) {
  // Calculate discount
  const discountPercent = 30;
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="text-2xl font-bold">Special Offer</span>
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              {discountPercent}% OFF
            </Badge>
          </DialogTitle>
          <DialogDescription>
            We'd hate to see you go. How about a special discount?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-4 bg-green-50 rounded-md">
            <div className="flex justify-between items-center border-b border-green-200 pb-2 mb-3">
              <span className="font-semibold">Current Plan: {planName}</span>
              <PercentIcon className="h-5 w-5 text-green-600" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Get {discountPercent}% off for the next 3 months</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Keep all your current features and benefits</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>No commitments, cancel anytime</span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="font-medium text-green-700">
                This offer is valid for the next 24 hours only
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button 
            className="w-full" 
            onClick={onClaimOffer}
          >
            Continue & Claim Offer <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onContinueToCancel}
          >
            Continue to Cancel
          </Button>
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
