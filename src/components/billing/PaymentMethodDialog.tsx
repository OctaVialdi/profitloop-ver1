
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { stripeService } from "@/services/stripeService";
import { BillingPaymentMethod } from "@/types/organization";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPaymentMethod: BillingPaymentMethod | null | undefined;
  onUpdate: () => void;
  organizationId: string | null;
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  currentPaymentMethod,
  onUpdate,
  organizationId
}: PaymentMethodDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cardHolder: currentPaymentMethod?.name || "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  // Format expiry date with slash
  const formatExpiryDate = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length > 2) {
      return `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    return value;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = formatCardNumber(value.slice(0, 19)); // 16 digits + 3 spaces
    setFormData((prev) => ({
      ...prev,
      cardNumber: formattedValue,
    }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = formatExpiryDate(value.slice(0, 5)); // MM/YY format
    setFormData((prev) => ({
      ...prev,
      expiryDate: formattedValue,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "Card holder name is required";
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (formData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiryDate = "Expiry date must be in MM/YY format";
      } else {
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const numMonth = parseInt(month, 10);
        const numYear = parseInt(year, 10);

        if (numMonth < 1 || numMonth > 12) {
          newErrors.expiryDate = "Month must be between 1 and 12";
        } else if (
          numYear < currentYear ||
          (numYear === currentYear && numMonth < currentMonth)
        ) {
          newErrors.expiryDate = "Card has expired";
        }
      }
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !organizationId) {
      return;
    }

    try {
      setIsSubmitting(true);

      // In a real implementation, we would use Stripe Elements or similar
      // For demo purposes, we'll redirect to the Stripe portal
      const portalUrl = await stripeService.createPortalSession();
      if (portalUrl) {
        toast.success("Redirecting to payment management portal");
        window.location.href = portalUrl;
      } else {
        throw new Error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("Failed to update payment method. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {currentPaymentMethod ? "Update Payment Method" : "Add Payment Method"}
          </DialogTitle>
          <DialogDescription>
            Enter your card details below to {currentPaymentMethod ? "update your" : "add a new"} payment method.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cardHolder">Card Holder Name</Label>
              <Input
                id="cardHolder"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleChange}
                placeholder="John Doe"
                autoComplete="cc-name"
              />
              {errors.cardHolder && (
                <p className="text-sm text-red-500">{errors.cardHolder}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  autoComplete="cc-number"
                  className="pl-10"
                />
                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.cardNumber && (
                <p className="text-sm text-red-500">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  autoComplete="cc-exp"
                />
                {errors.expiryDate && (
                  <p className="text-sm text-red-500">{errors.expiryDate}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  type="password"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={4}
                  autoComplete="cc-csc"
                />
                {errors.cvv && (
                  <p className="text-sm text-red-500">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Save</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
