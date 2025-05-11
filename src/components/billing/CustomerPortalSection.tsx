
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { stripeService } from "@/services/stripeService";
import { hasPaidSubscription } from "@/utils/subscription";

interface CustomerPortalSectionProps {
  subscriptionActive: boolean;
}

export function CustomerPortalSection({ subscriptionActive }: CustomerPortalSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPortal = async () => {
    try {
      setIsLoading(true);
      const portalUrl = await stripeService.createPortalSession();
      if (portalUrl) {
        window.location.href = portalUrl;
      } else {
        throw new Error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Failed to open customer portal. Please try again.");
      setIsLoading(false);
    }
  };

  if (!subscriptionActive) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Customer Portal</h2>
          <p className="text-gray-500 max-w-lg mb-4 md:mb-0">
            Access the customer portal to manage your subscription, update payment methods, and view billing history.
          </p>
        </div>
        <Button onClick={handleOpenPortal} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opening...
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Customer Portal
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
