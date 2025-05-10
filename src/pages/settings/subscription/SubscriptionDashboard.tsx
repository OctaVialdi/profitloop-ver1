
import { useOrganization } from "@/hooks/useOrganization";
import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionOverview } from "./SubscriptionOverview";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function SubscriptionDashboard() {
  const { organization, isTrialActive, daysLeftInTrial, hasPaidSubscription } = useOrganization();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subscription</h2>
          <p className="text-muted-foreground">
            Manage your subscription and payment information
          </p>
        </div>
        
        <Button asChild>
          <Link to="/settings/subscription/plans">
            <Plus className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <SubscriptionOverview />
        </CardContent>
      </Card>
    </div>
  );
}
