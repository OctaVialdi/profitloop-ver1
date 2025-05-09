
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PremiumFeature from "@/components/PremiumFeature";
import { useOrganization } from "@/hooks/useOrganization";

const PremiumFeatureDemo = () => {
  const { isTrialActive, hasPaidSubscription } = useOrganization();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Premium Feature Demo</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Regular Feature */}
        <Card>
          <CardHeader>
            <CardTitle>Regular Feature</CardTitle>
            <CardDescription>Available to all users</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This feature is available to all users regardless of their subscription status.</p>
          </CardContent>
          <CardFooter>
            <Button>Use Feature</Button>
          </CardFooter>
        </Card>
        
        {/* Premium Feature */}
        <PremiumFeature 
          tooltip="This feature requires a premium subscription or active trial"
        >
          <Card>
            <CardHeader>
              <CardTitle>Premium Feature</CardTitle>
              <CardDescription>Available to premium subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature is only available during trial or with a paid subscription.</p>
            </CardContent>
            <CardFooter>
              <Button>Use Premium Feature</Button>
            </CardFooter>
          </Card>
        </PremiumFeature>
        
        {/* More Premium Features with Different Tooltip Positions */}
        <PremiumFeature 
          tooltip="Analytics dashboard with detailed insights"
          tooltipPosition="bottom"
        >
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Advanced insights and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Get detailed analytics and reporting for your organization's performance.</p>
            </CardContent>
            <CardFooter>
              <Button>Open Dashboard</Button>
            </CardFooter>
          </Card>
        </PremiumFeature>
      </div>
      
      {/* Current Subscription Status */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Current Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This section shows your current subscription status to help you understand what features you can access.</p>
          
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span>Trial Active:</span>
              <span className={isTrialActive ? "text-green-600 font-medium" : "text-red-600"}>
                {isTrialActive ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Premium Subscription:</span>
              <span className={hasPaidSubscription ? "text-green-600 font-medium" : "text-gray-600"}>
                {hasPaidSubscription ? "Active" : "Not Active"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Access to Premium Features:</span>
              <span className={(isTrialActive || hasPaidSubscription) ? "text-green-600 font-medium" : "text-red-600"}>
                {(isTrialActive || hasPaidSubscription) ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant={hasPaidSubscription ? "outline" : "default"}
            onClick={() => window.location.href = "/settings/subscription"}
          >
            {hasPaidSubscription ? "Manage Subscription" : "Upgrade Now"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PremiumFeatureDemo;
