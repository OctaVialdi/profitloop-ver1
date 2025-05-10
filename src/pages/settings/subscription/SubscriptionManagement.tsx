
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/hooks/useOrganization";
import { stripeService } from "@/services/stripeService";
import { analyticsService } from "@/services/analyticsService";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function SubscriptionManagement() {
  const { organization, subscriptionPlan } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [prorationDetails, setProrationDetails] = useState<{
    prorationDate: Date;
    amountDue: number;
    credit: number;
    newAmount: number;
    daysLeft: number;
    totalDaysInPeriod: number;
    currentPlanName?: string;
    newPlanName?: string;
  } | null>(null);
  const [newPlanId, setNewPlanId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get plan details from query params if available
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const planId = queryParams.get('plan');
    
    if (planId && organization?.id && organization?.subscription_plan_id) {
      setNewPlanId(planId);
      loadProrationDetails(planId, organization.subscription_plan_id);
    }
  }, [organization?.id, organization?.subscription_plan_id]);

  // Load proration details when changing plans
  const loadProrationDetails = async (newPlanId: string, currentPlanId: string) => {
    try {
      setIsLoading(true);
      const details = await stripeService.getProratedCalculation(newPlanId, currentPlanId);
      setProrationDetails(details);
    } catch (error) {
      console.error("Error calculating proration:", error);
      toast.error("Failed to calculate subscription change details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening the billing portal
  const handleOpenBillingPortal = async () => {
    try {
      setPortalLoading(true);
      const portalUrl = await stripeService.createPortalSession();
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Error opening billing portal:", error);
      toast.error("Failed to open billing portal. Please try again later.");
      setPortalLoading(false);
    }
  };

  // Handle subscription change confirmation
  const handleConfirmChange = async () => {
    if (!newPlanId || !organization?.subscription_plan_id) return;
    
    try {
      setIsLoading(true);
      // Track checkout initiated event
      analyticsService.trackEvent({
        eventType: "subscription_change_initiated",
        organizationId: organization?.id,
        additionalData: { 
          currentPlanId: organization?.subscription_plan_id,
          newPlanId
        }
      });
      
      // Create checkout session for prorated amount
      const checkoutUrl = await stripeService.createProratedCheckout(
        newPlanId, 
        organization.subscription_plan_id
      );
      
      // Redirect to checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Failed to create checkout session. Please try again later.");
      setIsLoading(false);
    }
  };

  // Handle cancel change
  const handleCancelChange = () => {
    navigate("/settings/subscription");
  };

  // If no proration details and no newPlanId, show current subscription
  if (!prorationDetails && !newPlanId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Manage your current subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">
                  {subscriptionPlan?.name || "Basic Plan"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {subscriptionPlan?.price ? `Rp ${subscriptionPlan.price.toLocaleString()}` : "Free"} / month
                </p>
              </div>
              
              <Button 
                onClick={handleOpenBillingPortal} 
                disabled={portalLoading} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                {portalLoading ? "Opening..." : "Manage Billing"}
                <ExternalLink size={16} />
              </Button>
              
              <div className="border-t pt-4 mt-6">
                <Button
                  onClick={() => navigate("/settings/subscription/plans")}
                  variant="outline"
                >
                  Change Subscription Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show proration details when changing plans
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Change Subscription</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription Change Details</CardTitle>
          <CardDescription>Review the details of your subscription change</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current and new plan */}
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <h3 className="font-medium text-lg">
                    {prorationDetails?.currentPlanName || subscriptionPlan?.name || "Basic Plan"}
                  </h3>
                </div>
                <div className="p-4 border rounded-md bg-muted/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">New Plan</p>
                  </div>
                  <h3 className="font-medium text-lg">
                    {prorationDetails?.newPlanName || "Premium Plan"}
                  </h3>
                </div>
              </div>
              
              {/* Billing summary */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Billing Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Credit from current plan</span>
                    <span>-Rp {prorationDetails?.credit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New plan amount</span>
                    <span>Rp {prorationDetails?.newAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                    <span>Amount due now</span>
                    <span>Rp {prorationDetails?.amountDue.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>
                    Your current billing cycle has {prorationDetails?.daysLeft || 0} days remaining 
                    out of {prorationDetails?.totalDaysInPeriod || 30} days.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={handleConfirmChange} 
                  disabled={isLoading} 
                  className="flex-1"
                >
                  Confirm Change
                </Button>
                <Button 
                  onClick={handleCancelChange} 
                  variant="outline" 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
