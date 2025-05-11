import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/organization";

const Subscription = () => {
  const { organization, isTrialActive, daysLeftInTrial, hasPaidSubscription } = useOrganization();
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (organization && organization.subscription_plan_id) {
      const foundPlan = plans.find(plan => plan.id === organization.subscription_plan_id);
      if (foundPlan) {
        setCurrentPlan(foundPlan);
      }
    }
  }, [organization, plans]);

  // Fetch plans from Supabase
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        
        // Get all active subscription plans
        const { data: subscriptionPlans, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: true });
          
        if (error) {
          console.error("Error fetching subscription plans:", error);
          toast.error("Error loading subscription plans");
          return;
        }
        
        // Find the current plan if organization has one selected
        if (organization?.subscription_plan_id && subscriptionPlans) {
          const current = subscriptionPlans.find(
            plan => plan.id === organization.subscription_plan_id
          ) || null;
        
          if (current) {
            // Transform JSON features to Record type if needed
            const transformedCurrent: SubscriptionPlan = {
              ...current,
              features: current.features as Record<string, any> | null
            };
            setCurrentPlan(transformedCurrent);
          }
        }
      
        // Format plans for display
        if (subscriptionPlans) {
          const formattedPlans: SubscriptionPlan[] = subscriptionPlans.map(plan => ({
            ...plan,
            features: plan.features as Record<string, any> | null
          }));
        
          setPlans(formattedPlans);
        }
      } catch (error) {
        console.error("Error loading subscription data:", error);
        toast.error("Failed to load subscription information");
      } finally {
        setIsLoading(false);
      }
    };

    if (organization) {
      fetchPlans();
    }
  }, [organization]);

  const handleFreePlanSelection = async () => {
    if (!organization) return;
    
    try {
      setSubscribeLoading(true);
      
      // Find basic plan from our plans
      const basicPlan = plans.find(p => p.price === 0);
      if (!basicPlan) {
        toast.error("Basic plan not found");
        return;
      }
      
      // Update organization with selected plan
      const { error } = await supabase
        .from('organizations')
        .update({ 
          subscription_plan_id: basicPlan.id,
          subscription_status: 'active',
          trial_expired: false
        })
        .eq('id', organization.id);
      
      if (error) {
        console.error("Error updating subscription:", error);
        toast.error("Failed to update subscription");
        return;
      }
      
      // Show success message and refresh org data
      toast.success("Successfully upgraded to Free plan");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error selecting free plan:", error);
      toast.error("Failed to select free plan");
    } finally {
      setSubscribeLoading(false);
    }
  };

  const renderTrialStatus = () => {
    if (!organization) return null;
    
    if (organization.trial_end_date && !organization.trial_expired) {
      const trialEndDate = new Date(organization.trial_end_date);
      const now = new Date();
      const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

      return (
        <div className="mb-4 p-3 rounded-md bg-green-50 text-green-800">
          <p>
            <CheckCircle2 className="inline-block mr-2 h-4 w-4 align-middle" />
            Your trial is active! {daysLeft} days left.
          </p>
        </div>
      );
    }
    
    if (organization.trial_expired && !organization.subscription_plan_id) {
      return (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800">
          <p>
            <XCircle className="inline-block mr-2 h-4 w-4 align-middle" />
            Your trial has expired. Please select a plan to continue.
          </p>
        </div>
      );
    }

    return null;
  };

  // Format price display based on pricing model
  const formatPrice = (plan: SubscriptionPlan) => {
    if (plan.price_per_member) {
      return (
        <>
          ${plan.price_per_member}
          <span className="text-sm text-muted-foreground">/member/month</span>
        </>
      );
    } else {
      return (
        <>
          ${plan.price}
          <span className="text-sm text-muted-foreground">/month</span>
        </>
      );
    }
  };

  const renderPlans = () => {
    if (!organization) return null;
    
    // Hide plans if trial expired without a paid plan
    if (organization.trial_expired && !organization.subscription_plan_id) {
      return (
        <div className="mb-4 p-3 rounded-md bg-yellow-50 text-yellow-800">
          <p>
            <XCircle className="inline-block mr-2 h-4 w-4 align-middle" />
            Your trial has expired. Please select a plan to continue.
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.current ? "border-2 border-primary" : ""}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription>
                {plan.deskripsi || "A great plan for your organization"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-4xl font-bold">
                {formatPrice(plan)}
              </div>
              <Separator />
              <ul className="list-none pl-0 space-y-1">
                <li>Max Members: {plan.max_members}</li>
                {plan.features &&
                  typeof plan.features === 'object' && (
                    <ul className="mt-4 space-y-2">
                      {Object.entries(plan.features).map(([key, value]) => (
                        <li key={key} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{key}: {String(value)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
              </ul>
            </CardContent>
            <div className="p-4">
              {plan.price === 0 && !plan.price_per_member ? (
                <Button
                  className="w-full"
                  onClick={handleFreePlanSelection}
                  disabled={subscribeLoading}
                >
                  {subscribeLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Upgrading...
                    </>
                  ) : (
                    "Select Free Plan"
                  )}
                </Button>
              ) : (
                <Button className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Subscription Plans</CardTitle>
          <CardDescription>Choose a subscription plan that fits your needs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Loading subscription plans...
            </div>
          ) : (
            <>
              {renderTrialStatus()}
              {renderPlans()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscription;
