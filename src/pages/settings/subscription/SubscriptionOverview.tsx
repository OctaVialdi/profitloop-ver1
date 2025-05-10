
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useOrganization } from "@/hooks/useOrganization";
import { calculateProgressPercentage } from "@/utils/organizationUtils";
import { Calendar, Check, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function SubscriptionOverview() {
  const { organization, isTrialActive, daysLeftInTrial, hasPaidSubscription, subscriptionPlan } = useOrganization();

  // Calculate trial progress percentage
  const trialProgressPercentage = organization ? 
    calculateProgressPercentage(organization.trial_start_date, organization.trial_end_date) : 0;

  return (
    <div className="space-y-8">
      {/* Subscription Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <h3 className="text-xl font-bold">
            {subscriptionPlan?.name || "Basic Plan"}
            {isTrialActive && 
              <span className="ml-2 text-sm font-normal text-primary-foreground rounded-full bg-primary px-2 py-0.5">
                Trial
              </span>
            }
          </h3>
        </div>

        <Button asChild variant="outline">
          <Link to="/settings/subscription/management">
            Manage Subscription
          </Link>
        </Button>
      </div>

      {/* Trial Status (only if on trial) */}
      {isTrialActive && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Your free trial is active</h4>
                  <p className="text-sm text-muted-foreground">
                    You have {daysLeftInTrial} {daysLeftInTrial === 1 ? 'day' : 'days'} left in your trial
                  </p>
                </div>
              </div>
              
              <Button asChild size="sm">
                <Link to="/settings/subscription/plans">
                  Upgrade Now
                </Link>
              </Button>
            </div>
            
            {/* Trial progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Trial Progress</span>
                <span className="font-medium">{trialProgressPercentage}%</span>
              </div>
              <Progress value={trialProgressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Features */}
      <div>
        <h4 className="font-medium mb-4">Plan Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2 p-3 border rounded-lg">
            <Check className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Storage</p>
              <p className="text-sm text-muted-foreground">{subscriptionPlan?.features.storage || "5 GB"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 border rounded-lg">
            <Check className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Team Members</p>
              <p className="text-sm text-muted-foreground">{subscriptionPlan?.features.members || "Up to 5 members"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 border rounded-lg">
            <Check className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Support</p>
              <p className="text-sm text-muted-foreground">{subscriptionPlan?.features.support || "Email support"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 border rounded-lg">
            <Check className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Advanced Analytics</p>
              <p className="text-sm text-muted-foreground">
                {subscriptionPlan?.features.advanced_analytics ? "Included" : "Not included"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div>
        <h4 className="font-medium mb-4">Billing Information</h4>
        
        <div className="p-4 border rounded-lg">
          {hasPaidSubscription ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next billing date</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-medium">
                  Rp {subscriptionPlan?.price.toLocaleString() || "99,000"} / month
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <p className="text-center text-muted-foreground mb-3">
                {isTrialActive 
                  ? "You're currently on a free trial. No billing information available." 
                  : "No active subscription. Select a plan to continue using premium features."}
              </p>
              <Button asChild variant="outline">
                <Link to="/settings/subscription/plans">
                  View Plans
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
