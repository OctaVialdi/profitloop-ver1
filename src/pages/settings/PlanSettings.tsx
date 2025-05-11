
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { TrialProgressIndicator } from "@/components/subscription/TrialProgressIndicator";
import { TrialExpiredModal } from "@/components/subscription/TrialExpiredModal";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/organization";
import { useTrialStatus } from "@/hooks/useTrialStatus";

const PlanSettings: React.FC = () => {
  const navigate = useNavigate();
  const { 
    organization, 
    subscriptionPlan, 
    isTrialActive, 
    daysLeftInTrial, 
    hasPaidSubscription,
    refreshData 
  } = useOrganization();
  
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const { progress } = useTrialStatus(organization?.id || null);

  // Check if trial is expired without subscription
  useEffect(() => {
    if (organization?.trial_expired && !hasPaidSubscription) {
      setShowExpiredModal(true);
    }
  }, [organization, hasPaidSubscription]);

  // Fetch all subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price');
          
        if (error) {
          throw error;
        }
        
        setPlans(data || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  // Format features for display
  const formatFeatures = (features: Record<string, any> | null | undefined): string[] => {
    if (!features) return [];
    
    return Object.entries(features).map(([key, value]) => {
      // Format the feature key into a readable string
      const formattedKey = key.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return `${formattedKey}: ${value}`;
    });
  };

  const handleUpgrade = () => {
    navigate("/settings/subscription");
  };
  
  const handleRequestExtension = () => {
    navigate("/settings/subscription/request-extension");
  };
  
  const isCurrentPlan = (planId: string) => {
    return organization?.subscription_plan_id === planId;
  };

  const renderTrialBanner = () => {
    if (!isTrialActive || !daysLeftInTrial) return null;
    
    const isUrgent = daysLeftInTrial <= 3;
    
    return (
      <Alert className={isUrgent ? "bg-red-50 text-red-800 border-red-300" : "bg-yellow-50 text-yellow-800 border-yellow-300"}>
        {isUrgent ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <Info className="h-4 w-4" />
        )}
        <AlertDescription>
          {isUrgent 
            ? `Perhatian: Trial Anda akan berakhir dalam ${daysLeftInTrial} hari. Segera upgrade untuk terus menggunakan fitur lengkap.`
            : `Trial Anda tersisa ${daysLeftInTrial} hari.`
          }
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Plan Settings</h1>
      
      {/* Trial Banner */}
      {renderTrialBanner()}
      
      {/* Current Plan Details */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your current subscription plan and status
              </CardDescription>
            </div>
            {hasPaidSubscription ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            ) : isTrialActive ? (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Trial
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Expired
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Plan Name and Details */}
          <div className="space-y-2">
            <h3 className="text-xl font-medium">
              {subscriptionPlan?.name || (organization?.subscription_plan_id ? "Custom Plan" : "Free Plan")}
            </h3>
            {isTrialActive && (
              <TrialProgressIndicator 
                daysLeft={daysLeftInTrial} 
                progress={progress}
                showButton={false}
              />
            )}
          </div>
          
          <Separator />
          
          {/* Plan Features */}
          <div>
            <h4 className="font-medium mb-2">Plan Features:</h4>
            <ul className="space-y-2">
              {subscriptionPlan?.max_members && (
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> 
                  <span>Maximum {subscriptionPlan.max_members} team members</span>
                </li>
              )}
              
              {formatFeatures(subscriptionPlan?.features).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
              
              {(!subscriptionPlan || !subscriptionPlan?.features) && (
                <li className="text-gray-500">Basic features included</li>
              )}
            </ul>
          </div>
          
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpgrade}>
            {hasPaidSubscription ? "Change Plan" : "Upgrade Plan"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Plan Comparison */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {loading ? (
            <p>Loading plans...</p>
          ) : (
            plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={isCurrentPlan(plan.id) ? "border-primary border-2" : ""}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrentPlan(plan.id) && (
                      <Badge>Current</Badge>
                    )}
                  </div>
                  <CardDescription>{plan.deskripsi || `${plan.name} subscription plan`}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                    {plan.price > 0 && <span className="text-sm text-gray-500">/month</span>}
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.max_members && (
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> 
                        <span>Up to {plan.max_members} members</span>
                      </li>
                    )}
                    
                    {formatFeatures(plan.features).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleUpgrade} 
                    variant={isCurrentPlan(plan.id) ? "outline" : "default"}
                    disabled={isCurrentPlan(plan.id)}
                  >
                    {isCurrentPlan(plan.id) ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Trial Expired Modal */}
      <TrialExpiredModal 
        isOpen={showExpiredModal} 
        onClose={() => setShowExpiredModal(false)} 
        onUpgrade={handleUpgrade}
        onRequest={handleRequestExtension}
        allowClose={false}
        organizationName={organization?.name || "your organization"}
      />
    </div>
  );
};

export default PlanSettings;
