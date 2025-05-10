
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function SubscriptionManagement() {
  const { organization, subscriptionPlan, isTrialActive, daysLeftInTrial } = useOrganization();
  const { toast } = useToast();

  const handleManageSubscription = () => {
    toast({
      title: "Coming Soon",
      description: "Subscription management functionality will be available soon.",
    });
  };

  const handleViewInvoices = () => {
    toast({
      title: "Coming Soon",
      description: "Invoice viewing functionality will be available soon.",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Subscription Management</h2>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Review and manage your current subscription</CardDescription>
              </div>
              {isTrialActive && (
                <Badge variant="secondary" className="text-xs">
                  Trial: {daysLeftInTrial} days left
                </Badge>
              )}
              {!isTrialActive && subscriptionPlan && (
                <Badge variant="outline" className="text-xs">
                  {subscriptionPlan.name}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isTrialActive && (
              <div className="mb-4">
                <p className="text-sm mb-2">Trial period remaining:</p>
                <Progress value={daysLeftInTrial * 100 / 14} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{daysLeftInTrial} days remaining</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">
                  {isTrialActive ? "Trial Plan" : subscriptionPlan?.name || "No active plan"}
                </h3>
                <p className="text-sm text-gray-500">
                  {isTrialActive ? 
                    "You are currently on the trial version. Choose a plan before your trial ends." : 
                    subscriptionPlan ? 
                      `Your subscription renews on ${new Date().toLocaleDateString()}` : 
                      "No active subscription"
                  }
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleManageSubscription}>
                  {isTrialActive ? "Choose a Plan" : "Manage Subscription"}
                </Button>
                {!isTrialActive && (
                  <Button variant="outline" onClick={handleViewInvoices}>View Invoices</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
