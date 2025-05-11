import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Info, AlertTriangle, CreditCard, ShieldCheck, X } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { TrialProgressIndicator } from "@/components/subscription/TrialProgressIndicator";
import { TrialExpiredModal } from "@/components/subscription/TrialExpiredModal";
import { PricingDisplay } from "@/components/subscription/PricingDisplay"; 
import { CancelPlanDialog } from "@/components/subscription/CancelPlanDialog";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/organization";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { stripeService } from "@/services/stripeService";
import { toast } from "sonner";
import { PromotionCountdown } from "@/components/subscription/PromotionCountdown";
import { AIRecommendations } from "@/components/subscription/AIRecommendations";

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
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const { progress } = useTrialStatus(organization?.id || null);
  const [memberCount, setMemberCount] = useState<number>(1);
  const [showPromotion, setShowPromotion] = useState(true);

  // Check if trial is expired without subscription
  useEffect(() => {
    if (organization?.trial_expired && !hasPaidSubscription) {
      setShowExpiredModal(true);
    }

    // Get organization member count for per-member pricing calculations
    const fetchMemberCount = async () => {
      if (organization?.id) {
        try {
          const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', organization.id);
          
          if (!error && count !== null) {
            setMemberCount(Math.max(count, 1)); // Minimum 1 member
          }
        } catch (error) {
          console.error("Error fetching member count:", error);
        }
      }
    };

    fetchMemberCount();
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
        
        if (data) {
          // Process the data to ensure features is properly parsed
          const processedPlans: SubscriptionPlan[] = data.map(plan => {
            // Parse features if it's a string
            const features = typeof plan.features === 'string' 
              ? JSON.parse(plan.features) 
              : plan.features;
              
            return {
              ...plan,
              features: features as Record<string, any> | null
            };
          });
          
          setPlans(processedPlans);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  // Get categories from features objects across all plans
  const getFeatureCategories = () => {
    const categories = new Set<string>();
    
    plans.forEach(plan => {
      if (plan.features && typeof plan.features === 'object') {
        Object.keys(plan.features).forEach(key => {
          // Extract category from key using common naming conventions
          const category = key.split('_')[0];
          if (category) categories.add(category);
        });
      }
    });
    
    return Array.from(categories);
  };

  // Format features for display with categorization
  const formatFeatures = (features: Record<string, any> | null | undefined): Record<string, string[]> => {
    if (!features) return {};
    
    const categorizedFeatures: Record<string, string[]> = {};
    
    Object.entries(features).forEach(([key, value]) => {
      // Try to extract a category from the key (e.g., storage_limit -> storage)
      const categorySplit = key.split('_');
      const category = categorySplit[0] || 'general';
      
      if (!categorizedFeatures[category]) {
        categorizedFeatures[category] = [];
      }
      
      // Format the feature key into a readable string
      const formattedKey = key.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      categorizedFeatures[category].push(`${formattedKey}: ${value}`);
    });
    
    return categorizedFeatures;
  };

  // Check if a feature exists in a plan
  const planHasFeature = (plan: SubscriptionPlan, featureName: string): boolean | string => {
    if (!plan.features) return false;
    
    // Look for the feature in the features object with flexible matching
    for (const [key, value] of Object.entries(plan.features)) {
      if (key.toLowerCase().includes(featureName.toLowerCase())) {
        // Fix: Convert the value to string to ensure it's compatible with the return type
        return typeof value === 'string' || typeof value === 'boolean' 
          ? value 
          : String(value);
      }
    }
    
    return false;
  };

  const handleUpgrade = async (planId: string) => {
    if (isSubscribedToPlan(planId)) return;
    
    try {
      setSubmitting(true);
      setSelectedPlanId(planId);
      
      // If organization already has a subscription, handle as a plan change
      if (hasPaidSubscription && organization?.subscription_plan_id) {
        // Get portal session URL and redirect to Stripe customer portal
        const portalUrl = await stripeService.createPortalSession();
        if (portalUrl) {
          window.location.href = portalUrl;
          return;
        }
      } else {
        // New subscription flow
        const checkoutUrl = await stripeService.createCheckout(planId);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }
      }
      
      throw new Error("Failed to initiate checkout process");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to process upgrade. Please try again.");
    } finally {
      setSubmitting(false);
      setSelectedPlanId(null);
    }
  };
  
  const handleRequestExtension = () => {
    navigate("/settings/subscription/request-extension");
  };
  
  const handleCancelPlan = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancelPlan = async (reason: string) => {
    try {
      setSubmitting(true);
      
      if (hasPaidSubscription) {
        // Call the stripe service to cancel the subscription
        const success = await stripeService.cancelSubscription(reason);
        
        if (success) {
          toast.success("Your subscription has been cancelled successfully");
          // Refresh organization data to reflect changes
          await refreshData();
        } else {
          throw new Error("Failed to cancel subscription");
        }
      } else {
        // For free plans or trials, we just notify the user
        toast.success("Your plan has been cancelled");
        
        // If in trial, mark trial as expired
        if (organization?.id && (isTrialActive || !organization.trial_expired)) {
          const { error } = await supabase
            .from('organizations')
            .update({
              trial_expired: true,
              subscription_status: 'expired'
            })
            .eq('id', organization.id);
            
          if (error) {
            console.error("Error updating trial status:", error);
            throw new Error("Failed to update trial status");
          }
        }
        
        // Refresh organization data to reflect changes
        await refreshData();
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription. Please try again or contact support.");
      throw error; // Re-throw to be caught by the dialog
    } finally {
      setSubmitting(false);
    }
  };
  
  const isSubscribedToPlan = (planId: string) => {
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

  // Find if there's a recommended plan
  const getRecommendedPlan = () => {
    // Logic to determine recommended plan based on organization size and needs
    // For now, just return the middle-tier plan
    if (plans.length >= 3) {
      return plans[1].id; // Usually the middle plan is a good recommendation
    }
    return null;
  };

  // Get popular plan (most subscribed)
  const getPopularPlan = () => {
    // In a real implementation, this would check analytics data
    // For now, just return the middle plan as popular
    if (plans.length >= 3) {
      return plans[1].id;
    }
    return null;
  };

  const recommendedPlanId = getRecommendedPlan();
  const popularPlanId = getPopularPlan();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Plan Settings</h1>
      
      {/* Trial Banner */}
      {renderTrialBanner()}
      
      {/* Promotion Banner for Expired Trial */}
      {organization?.trial_expired && !hasPaidSubscription && showPromotion && (
        <PromotionCountdown 
          discount="20%" 
          onUpgrade={() => navigate('/settings/subscription')}
          className="mb-6"
        />
      )}
      
      {/* AI Recommendations for Expired Trial */}
      {organization?.trial_expired && !hasPaidSubscription && (
        <AIRecommendations 
          organizationId={organization?.id || null}
          onUpgrade={() => navigate('/settings/subscription')} 
          className="mb-6"
        />
      )}
      
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
            {subscriptionPlan && (
              <div className="text-2xl font-bold">
                <PricingDisplay 
                  plan={subscriptionPlan} 
                  memberCount={memberCount}
                />
              </div>
            )}
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
              
              {subscriptionPlan?.features && Object.entries(formatFeatures(subscriptionPlan.features)).map(([category, features]) => (
                <React.Fragment key={category}>
                  <li className="font-medium mt-3 first:mt-0">{category.charAt(0).toUpperCase() + category.slice(1)}:</li>
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center ml-4">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </React.Fragment>
              ))}
              
              {(!subscriptionPlan || !subscriptionPlan?.features) && (
                <li className="text-gray-500">Basic features included</li>
              )}
            </ul>
          </div>
          
        </CardContent>
        <CardFooter>
          {/* Always show "Cancel Plan" button regardless of subscription status */}
          <Button variant="destructive" onClick={handleCancelPlan}>
            <X className="mr-2 h-4 w-4" />
            Cancel Plan
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
                className={`relative ${isSubscribedToPlan(plan.id) ? "border-primary border-2" : ""}`}
              >
                {plan.id === recommendedPlanId && !isSubscribedToPlan(plan.id) && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    Recommended
                  </div>
                )}
                {plan.id === popularPlanId && !isSubscribedToPlan(plan.id) && plan.id !== recommendedPlanId && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{plan.name}</CardTitle>
                    {isSubscribedToPlan(plan.id) && (
                      <Badge>Current</Badge>
                    )}
                  </div>
                  <CardDescription>{plan.deskripsi || `${plan.name} subscription plan`}</CardDescription>
                  <div className="mt-2 font-bold">
                    <PricingDisplay 
                      plan={plan} 
                      memberCount={memberCount}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {/* Max Members Feature */}
                    {plan.max_members && (
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> 
                        <span>Up to {plan.max_members} members</span>
                      </li>
                    )}
                    
                    {/* Key Features */}
                    {plan.features && (
                      <>
                        {planHasFeature(plan, 'storage') && (
                          <li className="flex items-center">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            <span>Storage: {planHasFeature(plan, 'storage')}</span>
                          </li>
                        )}
                        {planHasFeature(plan, 'support') && (
                          <li className="flex items-center">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            <span>Support: {planHasFeature(plan, 'support')}</span>
                          </li>
                        )}
                        {planHasFeature(plan, 'integration') && (
                          <li className="flex items-center">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            <span>Integrations: {planHasFeature(plan, 'integration')}</span>
                          </li>
                        )}
                        {planHasFeature(plan, 'security') && (
                          <li className="flex items-center">
                            <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                            <span>Security: {planHasFeature(plan, 'security')}</span>
                          </li>
                        )}
                      </>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleUpgrade(plan.id)} 
                    variant={isSubscribedToPlan(plan.id) ? "outline" : "default"}
                    disabled={isSubscribedToPlan(plan.id) || submitting}
                    className="w-full"
                  >
                    {submitting && selectedPlanId === plan.id ? (
                      <>Loading...</>
                    ) : isSubscribedToPlan(plan.id) ? (
                      "Current Plan"
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        {organization?.trial_expired && !hasPaidSubscription 
                          ? "Select This Plan" 
                          : "Select Plan"
                        }
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Testimonials Section */}
      {(organization?.trial_expired && !hasPaidSubscription) && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-semibold">JD</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <p className="text-sm text-muted-foreground">Marketing Director</p>
                    <p className="mt-2 text-sm italic">"The premium features have transformed how we work. Well worth the investment."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-semibold">SP</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Parker</h4>
                    <p className="text-sm text-muted-foreground">Product Manager</p>
                    <p className="mt-2 text-sm italic">"We increased our productivity by 40% after upgrading to the Professional plan."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-semibold">AR</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Alex Rivera</h4>
                    <p className="text-sm text-muted-foreground">Tech Lead</p>
                    <p className="mt-2 text-sm italic">"The advanced features and support have been crucial to our team's success."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Trial Expired Modal */}
      <TrialExpiredModal 
        isOpen={showExpiredModal} 
        onClose={() => setShowExpiredModal(false)} 
        onUpgrade={() => navigate("/settings/subscription")}
        onRequest={handleRequestExtension}
        allowClose={false}
        organizationName={organization?.name || "your organization"}
      />

      {/* Cancel Subscription Dialog */}
      <CancelPlanDialog 
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirmCancel={handleConfirmCancelPlan}
        planName={subscriptionPlan?.name || "Subscription"}
      />
    </div>
  );
};

export default PlanSettings;
