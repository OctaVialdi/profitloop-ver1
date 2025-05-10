
import { useOrganization } from "@/hooks/useOrganization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Crown, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRupiah } from "@/utils/formatUtils";
import { useTrialStatus } from "@/hooks/useTrialStatus";

export function SubscriptionOverview() {
  const { organization, subscriptionPlan } = useOrganization();
  const { daysLeftInTrial, isTrialActive, progress } = useTrialStatus(organization);

  return (
    <>
      <div className="space-y-4">
        {/* Current Plan */}
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Crown className="mr-2 h-5 w-5 text-blue-500" />
              {isTrialActive ? "Trial Plan" : (subscriptionPlan?.name || "Basic Plan")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTrialActive ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trial period remaining</span>
                  <span className="font-medium">{daysLeftInTrial} days</span>
                </div>
                <Progress value={progress} className="h-2 w-full bg-blue-100" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">{formatRupiah(subscriptionPlan?.price || 0)}/month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Team size</span>
                  <span className="font-medium">Up to {subscriptionPlan?.max_members || 5} members</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {isTrialActive ? (
              <Button className="w-full" asChild>
                <Link to="/settings/subscription/plans">
                  Choose a plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" className="w-full" asChild>
                <Link to="/settings/subscription/management">
                  Manage subscription
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Expiration Notice */}
        {isTrialActive && daysLeftInTrial && daysLeftInTrial < 7 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center text-orange-700">
                <Clock className="mr-2 h-5 w-5" />
                Trial Ending Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700">
                Your trial will end in {daysLeftInTrial} days. Choose a plan to continue using all features.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                <Link to="/settings/subscription/plans">
                  Upgrade now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
}
