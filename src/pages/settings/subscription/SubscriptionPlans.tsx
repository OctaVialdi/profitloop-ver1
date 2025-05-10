
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { formatRupiah } from "@/utils/formatUtils";
import { toast } from "@/components/ui/sonner";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { stripeService } from "@/services/stripeService";
import { midtransService } from "@/services/midtransService";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { SubscriptionPlan } from "@/types/organization";

export default function SubscriptionPlans() {
  const { organization, subscriptionPlan: currentPlan } = useOrganization();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Use the custom hook for subscription plans
  const { plans, isLoading: plansLoading, error: plansError } = useSubscriptionPlans();
  
  // Function to check if a plan is currently active for the organization
  const isPlanActive = (planId: string): boolean => {
    if (!organization?.subscription_plan_id) return false;
    return organization.subscription_plan_id === planId;
  };
  
  // Function to render features for a plan
  const renderFeatures = (features: Record<string, any> | null): JSX.Element[] => {
    if (!features) return [];
    
    const featureItems = [];
    
    // Handle storage and members first if present
    if (features.storage) {
      featureItems.push(
        <li key="storage" className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>{features.storage} storage</span>
        </li>
      );
    }
    
    if (features.members) {
      featureItems.push(
        <li key="members" className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>{features.members}</span>
        </li>
      );
    }
    
    // Add support if present
    if (features.support) {
      featureItems.push(
        <li key="support" className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>{features.support}</span>
        </li>
      );
    }
    
    // Add remaining boolean features
    Object.entries(features).forEach(([key, value]) => {
      // Skip already handled features
      if (key === 'storage' || key === 'members' || key === 'support') {
        return;
      }
      
      // Only add features that are truthy
      if (value) {
        // Convert key from camelCase or snake_case to user-friendly text
        const featureName = key
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        featureItems.push(
          <li key={key} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>{featureName}</span>
          </li>
        );
      }
    });
    
    return featureItems;
  };
  
  // Function to handle plan selection
  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (!organization) {
      toast.error("Organization data not found");
      return;
    }
    
    // Track event
    await subscriptionAnalyticsService.trackPlanSelected(plan.id, organization.id);
    
    // If it's already the current plan, just navigate to subscription management
    if (isPlanActive(plan.id)) {
      navigate('/settings/subscription/management');
      return;
    }
    
    setSelectedPlan(plan.id);
    setIsLoading(true);
    
    try {
      // Track checkout initiated
      await subscriptionAnalyticsService.trackCheckoutInitiated(plan.id, organization.id);
      
      // Get checkout URL
      const checkoutUrl = await stripeService.createCheckoutSession(plan.id);
      
      // Redirect to checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session');
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };
  
  // While loading plans
  if (plansLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // If there was an error loading plans
  if (plansError) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <p className="text-red-500">Failed to load subscription plans</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Choose Plan</h2>
        <p className="text-muted-foreground">
          Select a subscription plan that best fits your business needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.id === 'standard-plan' ? 'border-blue-200' : 'border-gray-200'}`}
          >
            {plan.id === 'standard-plan' && (
              <div className="absolute -top-2 left-0 right-0 mx-auto w-max bg-blue-500 text-white text-xs px-3 py-0.5 rounded-full">
                POPULAR
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                {plan.price === 0 ? 'Free' : `${formatRupiah(plan.price)}/month`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {renderFeatures(plan.features)}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={isPlanActive(plan.id) ? "secondary" : "default"}
                disabled={isLoading && selectedPlan === plan.id}
                onClick={() => handleSelectPlan(plan)}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isPlanActive(plan.id) ? (
                  "Current Plan"
                ) : (
                  `Select ${plan.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
