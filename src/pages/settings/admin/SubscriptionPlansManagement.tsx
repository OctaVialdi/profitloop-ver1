import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionPlan } from "@/types/organization";

export default function SubscriptionPlansManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Mock subscription plans data
    const mockPlans: SubscriptionPlan[] = [
      {
        id: "basic_plan",
        name: "Basic",
        slug: "basic",
        price: 0,
        max_members: 3,
        features: {
          storage: "1GB",
          api_calls: "100"
        },
        is_active: true
      },
      {
        id: "standard_plan",
        name: "Standard",
        slug: "standard",
        price: 249000,
        max_members: 10,
        features: {
          storage: "10GB",
          api_calls: "1000"
        },
        is_active: true
      },
      {
        id: "premium_plan",
        name: "Premium",
        slug: "premium",
        price: 499000,
        max_members: 25,
        features: {
          storage: "100GB",
          api_calls: "Unlimited"
        },
        is_active: true
      }
    ];
    
    setPlans(mockPlans);
    setIsLoading(false);
  }, []);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Plans Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading plans...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card key={plan.id} className="border-t-4 border-t-blue-500">
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(plan.price)}</p>
                    <p className="text-sm text-muted-foreground">Max users: {plan.max_members}</p>
                    <p className="text-sm">Storage: {plan.features?.storage}</p>
                    <p className="text-sm">API calls: {plan.features?.api_calls}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
