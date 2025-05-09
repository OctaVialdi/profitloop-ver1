import React from 'react';
import { useOrganization } from "@/hooks/useOrganization";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Timer } from 'lucide-react';
import TrialPersonalizedRecommendation from './TrialPersonalizedRecommendation';
import TrialExtensionRequestDialog from './TrialExtensionRequestDialog';
import TrialProgress from './dashboard/TrialProgress';
import FeaturesSummary from './dashboard/FeaturesSummary';
import { useTrialStatusStyles } from '@/hooks/trial/useTrialStatusStyles';
import { getTrialMilestone, trackTrialExtensionClick, trackTrialExtensionSuccess, trackTrialUpgradeClick } from './dashboard/trialAnalyticsHelpers';

interface TrialDashboardProps {
  className?: string;
}

const TrialDashboard: React.FC<TrialDashboardProps> = ({ className = '' }) => {
  const { organization, isTrialActive, hasPaidSubscription, daysLeftInTrial } = useOrganization();
  const [showExtensionDialog, setShowExtensionDialog] = React.useState(false);
  
  // If user has a paid subscription, don't show trial dashboard
  if (hasPaidSubscription || !organization) {
    return null;
  }
  
  // Get trial milestone and styling based on trial status
  const milestone = getTrialMilestone(organization);
  const styles = useTrialStatusStyles(isTrialActive, daysLeftInTrial);
  
  // Handle trial extension request
  const handleExtensionRequest = () => {
    setShowExtensionDialog(true);
    trackTrialExtensionClick(organization?.id);
  };
  
  // Handle upgrade button click
  const handleUpgradeClick = () => {
    trackTrialUpgradeClick(organization?.id, daysLeftInTrial, milestone);
  };
  
  // Handle successful extension request
  const handleExtensionSuccess = () => {
    trackTrialExtensionSuccess(organization?.id);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className={`${styles.containerClass}`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${styles.titleClass}`}>
            <Timer className="mr-2 h-5 w-5" />
            {isTrialActive 
              ? "Status Trial" 
              : "Trial Telah Berakhir"}
          </CardTitle>
          <CardDescription>
            {isTrialActive 
              ? "Periode trial Anda sedang berjalan. Jelajahi semua fitur premium kami." 
              : "Trial Anda telah berakhir. Silakan berlangganan untuk terus menggunakan semua fitur."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Trial Progress */}
          <TrialProgress 
            organization={organization}
            isTrialActive={isTrialActive}
            daysLeftInTrial={daysLeftInTrial}
          />
          
          {/* Trial Features Summary */}
          <FeaturesSummary 
            isTrialActive={isTrialActive}
            daysLeftInTrial={daysLeftInTrial}
          />
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={styles.buttonVariant}
            className="w-full sm:w-auto flex-1"
            onClick={handleUpgradeClick}
            asChild
          >
            <a href="/settings/subscription">
              Upgrade Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          
          {!hasPaidSubscription && (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleExtensionRequest}
            >
              Minta Perpanjangan Trial
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Personalized recommendations */}
      {isTrialActive && (
        <TrialPersonalizedRecommendation />
      )}
      
      {/* Trial Extension Dialog */}
      <TrialExtensionRequestDialog
        open={showExtensionDialog}
        onOpenChange={setShowExtensionDialog}
        onRequestSuccess={handleExtensionSuccess}
      />
    </div>
  );
};

export default TrialDashboard;
