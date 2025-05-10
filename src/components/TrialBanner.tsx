
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useOrganization } from "@/hooks/useOrganization";
import { subscriptionService } from "@/services/subscriptionService";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { toast } from "@/components/ui/sonner";

export function TrialBanner() {
  const [isExtending, setIsExtending] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const navigate = useNavigate();
  
  const { organization, isTrialActive, daysLeftInTrial, hasPaidSubscription } = useOrganization();
  
  // Don't show banner if user has paid subscription or no org data
  if (hasPaidSubscription || !organization || isHidden) {
    return null;
  }
  
  // Only show for trial users with < 7 days left
  if (!isTrialActive || !daysLeftInTrial || daysLeftInTrial > 7) {
    return null;
  }
  
  // Calculate progress
  const progress = Math.max(0, Math.min(100, ((7 - daysLeftInTrial) / 7) * 100));
  
  // Whether it's critical (2 days or less)
  const isCritical = daysLeftInTrial <= 2;

  const handleExtendTrial = async () => {
    try {
      setIsExtending(true);
      
      // Track analytics
      await subscriptionAnalyticsService.trackEvent({
        eventType: "trial_extension_clicked",
        organizationId: organization.id
      });
      
      // Check if we can fix the trial automatically
      const result = await subscriptionService.fixOrganizationTrialPeriod(organization.id);
      
      if (result.success) {
        toast.success("Trial period has been extended!");
        // Force page reload to update trial status
        window.location.reload();
      } else {
        // Navigate to extension request form
        navigate('/settings/subscription/extension');
      }
    } catch (error) {
      console.error("Error extending trial:", error);
      toast.error("Failed to extend trial period");
    } finally {
      setIsExtending(false);
    }
  };
  
  const handleChoosePlan = async () => {
    // Track analytics
    if (organization) {
      await subscriptionAnalyticsService.trackTrialBannerClicked(organization.id, "choose_plan");
    }
    navigate('/settings/subscription/plans');
  };
  
  const handleSendReminder = async () => {
    setShowReminderDialog(true);
    
    try {
      // Send reminder email
      if (organization) {
        await subscriptionService.sendTrialReminderEmail(organization.id);
        toast.success("Reminder email has been sent to your team");
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Failed to send reminder email");
    } finally {
      setShowReminderDialog(false);
    }
  };
  
  return (
    <div className={`w-full px-4 py-2 ${isCritical ? 'bg-red-100' : 'bg-amber-50'}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`h-5 w-5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
          <div className="flex-1">
            <p className={`font-medium ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>
              Trial ends in {daysLeftInTrial} {daysLeftInTrial === 1 ? 'day' : 'days'}
            </p>
            <div className="flex items-center mt-1">
              <Progress 
                value={progress} 
                className={`h-1.5 w-24 ${isCritical ? 'bg-red-200' : 'bg-amber-200'}`} 
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsHidden(true)}
            className="text-xs"
          >
            Dismiss
          </Button>
          
          {!isExtending ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSendReminder}
              className="text-xs"
              disabled={showReminderDialog}
            >
              {showReminderDialog ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <ThumbsUp className="mr-1 h-3 w-3" />
                  Remind team
                </>
              )}
            </Button>
          ) : null}
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleExtendTrial}
            className="text-xs"
            disabled={isExtending}
          >
            {isExtending ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Extending...
              </>
            ) : (
              "Extend trial"
            )}
          </Button>
          
          <Button
            size="sm"
            onClick={handleChoosePlan}
            className={`text-xs ${isCritical ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            Choose plan
          </Button>
        </div>
      </div>
    </div>
  );
}
