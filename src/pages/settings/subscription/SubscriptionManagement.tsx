
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatRupiah } from "@/utils/formatUtils";
import { useOrganization } from "@/hooks/useOrganization";
import { stripeService } from "@/services/stripeService";
import { midtransService } from "@/services/midtransService";
import { toast } from "@/components/ui/sonner";
import { formatDate } from "@/utils/formatUtils";

export default function SubscriptionManagement() {
  const { organization, subscriptionPlan } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // State for prorated calculation
  const [proratedCalc, setProratedCalc] = useState({
    prorationDate: new Date(),
    amountDue: 0,
    credit: 0,
    newAmount: 0,
    daysLeft: 0,
    totalDaysInPeriod: 30,
    currentPlanName: "",
    newPlanName: ""
  });

  // Calculate upgrade cost when component mounts
  useEffect(() => {
    if (organization?.subscription_plan_id) {
      calculateUpgradeCost();
    }
  }, [organization?.subscription_plan_id]);

  // Calculate upgrade cost
  const calculateUpgradeCost = async () => {
    try {
      if (!organization?.subscription_plan_id) return;
      
      setIsLoading(true);
      
      // Mock prorated calculation for demonstration
      const data = await midtransService.getProratedAmount(
        "premium-plan", 
        organization.subscription_plan_id
      );
      
      // Convert the midtrans format to our expected format
      const formattedCalc = {
        prorationDate: new Date(),
        amountDue: data.total,
        credit: data.prorated_amount,
        newAmount: data.total - data.prorated_amount,
        daysLeft: 15,  // Mock value
        totalDaysInPeriod: 30,  // Standard month period
        currentPlanName: organization.subscription_plan_name || "Standard",
        newPlanName: "Premium"
      };
      
      setProratedCalc(formattedCalc);
    } catch (error) {
      console.error("Error calculating proration:", error);
      toast.error("Failed to calculate upgrade cost");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel subscription handler
  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      // Create billing portal session for cancellation
      const portalUrl = await stripeService.createPortalSession();
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Error navigating to billing portal:", error);
      toast.error("Failed to open billing portal");
      setIsLoading(false);
    }
  };

  // Upgrade subscription handler
  const handleUpgradeSubscription = async () => {
    setIsLoading(true);
    try {
      if (!organization?.subscription_plan_id) {
        throw new Error("No current subscription plan found");
      }
      
      // Create checkout for upgrade
      const checkoutUrl = await stripeService.createProratedCheckout(
        "premium-plan", 
        organization.subscription_plan_id
      );
      
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      toast.error("Failed to upgrade subscription");
      setIsLoading(false);
    }
  };

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <p className="text-muted-foreground">
          Manage your current subscription plan and payment details
        </p>
      </div>

      <div className="grid gap-6">
        {/* Current Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your organization is currently on the {organization.subscription_plan_name || "Standard"} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Price</span>
                <span>{formatRupiah(organization.subscription_price || 299000)}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Billing period</span>
                <span>Monthly</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Next billing date</span>
                <span>
                  {organization.subscription_end_date 
                    ? formatDate(organization.subscription_end_date) 
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Cancel subscription
            </Button>
            <Button onClick={() => navigate("/settings/subscription/plans")}>
              Change plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Upgrade to Premium Card */}
        {organization.subscription_plan_id && 
         organization.subscription_plan_id !== "premium-plan" && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Upgrade to Premium</CardTitle>
              <CardDescription>
                Get access to all premium features and increase your team limit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Current plan credit</span>
                  <span>{formatRupiah(proratedCalc.credit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Premium plan (prorated)</span>
                  <span>{formatRupiah(proratedCalc.amountDue)}</span>
                </div>
                <div className="border-t border-blue-200 my-2" />
                <div className="flex justify-between">
                  <span className="font-medium">Amount due now</span>
                  <span className="font-bold">{formatRupiah(proratedCalc.newAmount)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleUpgradeSubscription}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upgrade to Premium"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Keep subscription
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm cancellation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
