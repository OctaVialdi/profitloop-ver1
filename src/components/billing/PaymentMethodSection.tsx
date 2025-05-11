
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Edit2, 
  PlusCircle, 
  Check, 
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { BillingSettings } from "@/types/organization";
import { PaymentMethodDialog } from "./PaymentMethodDialog";
import { stripeService } from "@/services/stripeService";
import { midtransService } from "@/services/midtransService";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentMethodSectionProps {
  billingSettings: BillingSettings | null;
  organizationId: string | null;
  onUpdate: () => void;
  hasPaidSubscription: boolean;
}

export function PaymentMethodSection({ 
  billingSettings, 
  organizationId,
  onUpdate,
  hasPaidSubscription
}: PaymentMethodSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showStripeError, setShowStripeError] = useState(false);

  const hasPaymentMethod = billingSettings?.payment_method?.type === "card";
  const cardInfo = hasPaymentMethod ? billingSettings.payment_method : null;

  const openCustomerPortal = async () => {
    try {
      setIsRedirecting(true);
      setShowStripeError(false);
      const portalUrl = await stripeService.createPortalSession();
      if (portalUrl) {
        window.location.href = portalUrl;
      } else {
        throw new Error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Error redirecting to customer portal:", error);
      toast.error("Failed to open customer portal. Please try again later.");
      setShowStripeError(true);
      setIsRedirecting(false);
    }
  };

  const handleAddPaymentMethod = () => {
    setIsDialogOpen(true);
  };

  const renderCardInfo = () => {
    if (!cardInfo) return null;

    return (
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Card Type</span>
          <span className="font-medium">{cardInfo.brand || "Credit/Debit Card"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Card Number</span>
          <span className="font-medium">•••• •••• •••• {cardInfo.last4 || "****"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Expires</span>
          <span className="font-medium">
            {cardInfo.exp_month?.toString().padStart(2, '0') || "**"}/
            {cardInfo.exp_year?.toString().slice(-2) || "**"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Card Holder</span>
          <span className="font-medium">{cardInfo.name || "Card Holder"}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-bold mb-2 sm:mb-0">Payment Method</h2>
        
        <div className="flex flex-wrap gap-2">
          {hasPaymentMethod && hasPaidSubscription && (
            <Button
              variant="outline"
              size="sm"
              onClick={openCustomerPortal}
              disabled={isRedirecting}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {isRedirecting ? "Opening Portal..." : "Manage Payment Methods"}
            </Button>
          )}
          
          {!hasPaymentMethod ? (
            <Button 
              size="sm" 
              onClick={handleAddPaymentMethod}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Payment Method
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddPaymentMethod}
            >
              <Edit2 className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
        </div>
      </div>

      {showStripeError && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            Stripe payment services are currently unavailable. You can still add payment details for record-keeping purposes.
          </AlertDescription>
        </Alert>
      )}

      {hasPaymentMethod ? (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-md border">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium">
                {cardInfo?.brand || "Credit/Debit"} Card (Default)
              </div>
              <div className="text-sm text-gray-500">
                {cardInfo?.last4 ? `•••• ${cardInfo.last4}` : "•••• ••••"}
              </div>
            </div>
            {hasPaymentMethod && (
              <div className="ml-auto">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" /> Default
                </span>
              </div>
            )}
          </div>
          
          {renderCardInfo()}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-1">No Payment Method</h3>
          <p className="text-sm text-gray-500 mb-4">
            Add a payment method to manage your subscriptions and invoices.
          </p>
          <Button onClick={handleAddPaymentMethod}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add Payment Method
          </Button>
        </div>
      )}

      {isDialogOpen && (
        <PaymentMethodDialog 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          currentPaymentMethod={billingSettings?.payment_method}
          onUpdate={onUpdate}
          organizationId={organizationId}
          stripeUnavailable={showStripeError}
        />
      )}
    </Card>
  );
}
