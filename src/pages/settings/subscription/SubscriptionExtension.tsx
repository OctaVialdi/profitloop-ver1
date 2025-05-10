
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { subscriptionService } from "@/services/subscriptionService";
import { useOrganization } from "@/hooks/useOrganization";
import { analyticsService } from "@/services/analyticsService";

export default function SubscriptionExtension() {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { organization } = useOrganization();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmitRequest = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for your trial extension request",
        variant: "destructive"
      });
      return;
    }
    
    if (!organization?.id) {
      toast({
        title: "Error",
        description: "Organization data is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Track the event
      analyticsService.trackEvent({
        eventType: "trial_extension_requested",
        organizationId: organization.id,
        additionalData: { reason }
      });
      
      // Submit the extension request
      const result = await subscriptionService.requestTrialExtension(organization.id, reason);
      
      if (result.success) {
        toast({
          title: "Extension Request Submitted",
          description: "We have received your trial extension request. We'll review it and get back to you soon."
        });
        
        navigate("/settings/subscription");
      } else {
        toast({
          title: "Request Failed",
          description: result.message || "Failed to submit extension request. Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error requesting trial extension:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2" 
        onClick={() => navigate("/settings/subscription")}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Subscription</span>
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Request Trial Extension</CardTitle>
          <CardDescription>
            Let us know why you need more time with our trial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-medium">
                Reason for Extension
              </label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please explain why you need additional time with our trial..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Please provide details about why you need more time to evaluate our service.
                Our team will review your request and respond within 24 hours.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/settings/subscription")}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitRequest}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
