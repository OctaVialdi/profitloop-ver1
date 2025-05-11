import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { subscriptionAnalyticsService } from "@/services/subscription"; // Updated import path
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

const SubscriptionManagement = () => {
  const { organization, isTrialActive, daysLeftInTrial, hasPaidSubscription } = useOrganization();
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

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
        const { data: subscriptionPlans, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: true });

        if (error) {
          console.error("Error fetching subscription plans:", error);
          return;
        }

        if (organization?.subscription_plan_id && subscriptionPlans) {
          const current = subscriptionPlans.find(
            plan => plan.id === organization.subscription_plan_id
          ) || null;
          setCurrentPlan(current);
        }

        setPlans(subscriptionPlans || []);
      } catch (error) {
        console.error("Error loading subscription data:", error);
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
      const basicPlan = plans.find(p => p.price === 0);
      if (!basicPlan) {
        console.error("Basic plan not found");
        return;
      }

      const { error } = await supabase
        .from('organizations')
        .update({ subscription_plan_id: basicPlan.id })
        .eq('id', organization.id);

      if (error) {
        console.error("Error updating subscription:", error);
        return;
      }

      // Refresh org data
    } catch (error) {
      console.error("Error selecting free plan:", error);
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
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Your trial is active! {daysLeft} days left.
          </AlertDescription>
        </Alert>
      );
    }

    if (organization.trial_expired && !organization.subscription_plan_id) {
      return (
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Your trial has expired. Please select a plan to continue.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Manage your subscription and billing details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div>Loading subscription plans...</div>
          ) : (
            <>
              {renderTrialStatus()}
              <Tabs defaultValue="plans" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
                  <TabsTrigger value="billing">Billing History</TabsTrigger>
                </TabsList>
                <TabsContent value="plans">
                  <div className="grid gap-4 md:grid-cols-3">
                    {plans.map((plan) => (
                      <Card key={plan.id}>
                        <CardHeader>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>{plan.deskripsi || "A great plan for your organization"}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-bold">${plan.price}/month</div>
                          <ul>
                            <li>Max Members: {plan.max_members}</li>
                            {/* Display other plan features here */}
                          </ul>
                        </CardContent>
                        <Button onClick={handleFreePlanSelection} disabled={subscribeLoading}>
                          {subscribeLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Upgrading...
                            </>
                          ) : (
                            "Select Plan"
                          )}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="billing">
                  <div>Billing history will be displayed here.</div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
