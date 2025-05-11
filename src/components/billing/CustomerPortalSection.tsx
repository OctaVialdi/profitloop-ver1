
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { stripeService } from "@/services/stripeService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface CustomerPortalSectionProps {
  subscriptionActive: boolean;
  organizationId: string | null;
}

export function CustomerPortalSection({ subscriptionActive, organizationId }: CustomerPortalSectionProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [stripeError, setStripeError] = useState(false);
  const navigate = useNavigate();

  const openCustomerPortal = async () => {
    if (!organizationId) {
      toast.error("Organization ID is required");
      return;
    }

    try {
      setIsRedirecting(true);
      setStripeError(false);

      const portalUrl = await stripeService.createPortalSession();
      if (portalUrl) {
        window.location.href = portalUrl;
      } else {
        throw new Error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Error accessing customer portal:", error);
      toast.error("Failed to access customer portal. You can still manage your subscription from the Plans page.");
      setStripeError(true);
      setIsRedirecting(false);
    }
  };

  const goToSubscriptionPage = () => {
    navigate("/settings/plan");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Manage Subscription</h2>

      {stripeError && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            Payment portal access is currently unavailable. You can still manage your subscription from the Plans page.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-gray-600 mb-6">
        <p className="mb-2">
          {subscriptionActive
            ? "Manage your subscription settings, update your payment method, or view your billing history."
            : "You don't have an active subscription. Visit the Plans page to select a subscription plan."}
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {subscriptionActive ? (
          <Button
            variant="default"
            onClick={openCustomerPortal}
            disabled={isRedirecting}
          >
            {isRedirecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="mr-2 h-4 w-4" />
            )}
            {isRedirecting ? "Opening Portal..." : "Customer Portal"}
          </Button>
        ) : (
          <Button onClick={goToSubscriptionPage}>
            View Plans <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        
        {stripeError && subscriptionActive && (
          <Button variant="outline" onClick={goToSubscriptionPage}>
            View Plans <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
