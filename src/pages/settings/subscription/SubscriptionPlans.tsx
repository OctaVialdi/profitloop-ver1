
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";
import { Badge } from "@/components/ui/badge";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useOrganization } from "@/hooks/useOrganization";

export default function SubscriptionPlans() {
  const { plans, isLoading } = useSubscriptionPlans();
  const { subscriptionPlan } = useOrganization();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = subscriptionPlan?.id === plan.id;
          
          return (
            <Card key={plan.id} className={`${isCurrentPlan ? "border-2 border-primary" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrentPlan && (
                      <Badge variant="outline" className="mt-1">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatCurrency(plan.price)}
                    </div>
                    <div className="text-sm text-gray-500">/month</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{plan.features.storage} Storage</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{plan.features.members}</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{plan.features.support}</span>
                    </div>
                    <div className="flex items-center">
                      <Check className={`h-4 w-4 mr-2 ${plan.features.advanced_analytics ? "text-green-500" : "text-gray-300"}`} />
                      <span className={!plan.features.advanced_analytics ? "text-gray-400" : ""}>
                        Advanced Analytics
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? "Current Plan" : "Select Plan"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
