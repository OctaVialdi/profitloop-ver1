import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Loader2 } from "lucide-react";
import { useOrganization } from "@/hooks/organization/useOrganization";
import { formatRupiah } from "@/utils/formatUtils";
import { toast } from "sonner";
import { stripeService } from "@/services/stripeService";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { SubscriptionPlan } from "@/types/organization";
import { subscriptionService } from "@/services/subscriptionService";

const SubscriptionPlans = () => {
  const { organizationData } = useOrganization();
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false);

  // Use the mock service instead of querying Supabase directly
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => subscriptionService.getSubscriptionPlans(),
    enabled: !!organizationData.organization?.id
  });
  
  const handleCheckout = async (planId: string, planName: string) => {
    try {
      setIsCheckoutLoading(true);
      
      if (!organizationData.organization?.id) {
        toast.error("Tidak dapat menemukan ID organisasi");
        return;
      }
      
      // Track checkout initiation
      subscriptionAnalyticsService.trackCheckoutInitiated(
        planId, 
        'subscription_page', 
        organizationData.organization?.id
      );
      
      // Get checkout URL
      const checkoutUrl = await stripeService.createCheckout(planId);
      
      if (checkoutUrl) {
        toast.success(`Redirecting to checkout for ${planName}`);
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Tidak bisa membuat sesi checkout");
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
      toast.error("Gagal memulai proses checkout. Silakan coba lagi.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Subscription Plans</h2>
        <p className="text-muted-foreground">
          Choose the plan that fits your business needs
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`flex flex-col ${organizationData.organization?.subscription_plan_id === plan.id ? 'border-primary/50 bg-primary/5' : ''}`}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.max_members ? `Up to ${plan.max_members} employees` : 'Unlimited employees'}
                </CardDescription>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{formatRupiah(plan.price)}</span>
                  <span className="text-sm text-muted-foreground"> / month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {Object.entries(plan.features || {}).map(([key, value]) => (
                    <li key={key} className="flex items-center">
                      {value ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 mr-2 text-gray-300" />
                      )}
                      <span>{key.replace('_', ' ')}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleCheckout(plan.id, plan.name)}
                  disabled={isCheckoutLoading || organizationData.organization?.subscription_plan_id === plan.id}
                  className="w-full"
                  variant={organizationData.organization?.subscription_plan_id === plan.id ? "outline" : "default"}
                >
                  {isCheckoutLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : organizationData.organization?.subscription_plan_id === plan.id ? (
                    "Current Plan"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
