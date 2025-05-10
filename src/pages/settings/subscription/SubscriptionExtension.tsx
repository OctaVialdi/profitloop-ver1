
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { subscriptionService } from "@/services/subscriptionService";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { toast } from "@/components/ui/sonner";

export default function SubscriptionExtension() {
  const { organization } = useOrganization();
  const [reason, setReason] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const requestExtension = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organization?.id) {
      toast.error("Organization ID not found");
      return;
    }
    
    if (!reason) {
      toast.error("Please provide a reason for requesting extension");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Request extension
      const result = await subscriptionService.requestTrialExtension(organization.id, reason);
      
      if (result.success) {
        // Track event
        await subscriptionAnalyticsService.trackTrialExtensionRequested(organization.id, reason);
        
        toast.success("Trial extension request submitted successfully");
        setReason("");
        setContactEmail("");
      } else {
        throw new Error("Failed to submit request");
      }
    } catch (error: any) {
      console.error("Error requesting extension:", error);
      toast.error(error.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Request Trial Extension</h2>
        <p className="text-muted-foreground">
          Need more time to evaluate our platform? Submit a request for trial extension.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Extension Request</CardTitle>
          <CardDescription>
            Tell us why you need more time and we'll review your request.
          </CardDescription>
        </CardHeader>
        <form onSubmit={requestExtension}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="reason">Reason for extension</Label>
              <Textarea
                id="reason"
                placeholder="Please explain why you need more time with our platform..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Contact email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email for follow-up"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                If different from your account email
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="ml-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
