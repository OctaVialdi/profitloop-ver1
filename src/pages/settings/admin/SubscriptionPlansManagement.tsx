
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatUtils";

export default function SubscriptionPlansManagement() {
  // Mock data for subscription plans
  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 99000,
      max_members: 5,
      features: {
        storage: "5 GB",
        api_calls: "10,000/month",
        members: "5 members",
        support: "Email only",
        advanced_analytics: false
      },
      is_active: true
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: 299000,
      max_members: 20,
      features: {
        storage: "20 GB",
        api_calls: "50,000/month",
        members: "20 members",
        support: "Priority email",
        advanced_analytics: true
      },
      is_active: true
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: 999000,
      max_members: 100,
      features: {
        storage: "100 GB",
        api_calls: "Unlimited",
        members: "Unlimited",
        support: "24/7 phone & email",
        advanced_analytics: true
      },
      is_active: true
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Subscription Plans Management</h2>
        <Button>Add New Plan</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <Card key={plan.id} className="overflow-hidden">
            <div className="bg-primary p-4">
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            </div>
            <CardContent className="p-4">
              <div className="mb-4">
                <span className="text-2xl font-bold">{formatCurrency(plan.price)}</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p><strong>Storage:</strong> {plan.features.storage}</p>
                <p><strong>API Calls:</strong> {plan.features.api_calls}</p>
                <p><strong>Max Members:</strong> {plan.features.members}</p>
                <p><strong>Support:</strong> {plan.features.support}</p>
                <p><strong>Advanced Analytics:</strong> {plan.features.advanced_analytics ? "Yes" : "No"}</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="w-full">Edit</Button>
                <Button variant={plan.is_active ? "destructive" : "default"} className="w-full">
                  {plan.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
