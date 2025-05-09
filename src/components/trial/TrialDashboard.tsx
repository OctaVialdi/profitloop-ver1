
import React from 'react';
import { useOrganization } from "@/hooks/useOrganization";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Calendar, Clock, Info, Sparkles, Timer } from 'lucide-react';
import { formatTrialCountdown } from "@/utils/organizationUtils";
import { trackTrialEvent } from '@/services/analyticsService';
import TrialPersonalizedRecommendation from './TrialPersonalizedRecommendation';
import TrialExtensionRequestDialog from './TrialExtensionRequestDialog';

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
  
  // Calculate trial progress percentage
  const calculateTrialProgress = () => {
    if (!organization.trial_start_date || !organization.trial_end_date) return 0;
    
    const start = new Date(organization.trial_start_date).getTime();
    const end = new Date(organization.trial_end_date).getTime();
    const now = new Date().getTime();
    const totalDuration = end - start;
    const elapsed = now - start;
    
    // Return elapsed percentage (0 to 100)
    return Math.max(0, Math.min(100, (elapsed / totalDuration * 100)));
  };
  
  // Handle trial milestones based on progress
  const getTrialMilestone = () => {
    const progress = calculateTrialProgress();
    
    if (progress < 10) return 'beginning';
    if (progress >= 90) return 'ending';
    if (progress >= 75) return '75-percent';
    if (progress >= 50) return 'halfway';
    if (progress >= 25) return '25-percent';
    return null;
  };
  
  // Get appropriate styling based on trial status
  const getStatusStyles = () => {
    if (!isTrialActive) {
      return {
        containerClass: 'border-red-200 bg-red-50',
        titleClass: 'text-red-800',
        progressClass: 'bg-red-500',
        buttonVariant: 'destructive' as const
      };
    }
    
    if (daysLeftInTrial <= 3) {
      return {
        containerClass: 'border-amber-200 bg-amber-50',
        titleClass: 'text-amber-800',
        progressClass: 'bg-amber-500',
        buttonVariant: 'warning' as const
      };
    }
    
    return {
      containerClass: 'border-blue-200 bg-blue-50',
      titleClass: 'text-blue-800',
      progressClass: 'bg-blue-500',
      buttonVariant: 'default' as const
    };
  };
  
  const styles = getStatusStyles();
  const milestone = getTrialMilestone();
  
  // Handle trial extension request
  const handleExtensionRequest = () => {
    setShowExtensionDialog(true);
    
    if (organization?.id) {
      trackTrialEvent('extension_request_click', organization.id);
    }
  };
  
  // Handle upgrade button click
  const handleUpgradeClick = () => {
    if (organization?.id) {
      trackTrialEvent('dashboard_upgrade_click', organization.id, { 
        days_left: daysLeftInTrial,
        milestone
      });
    }
  };
  
  // Handle successful extension request
  const handleExtensionSuccess = () => {
    if (organization?.id) {
      trackTrialEvent('extension_request_success', organization.id);
    }
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
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <Calendar className="mr-1.5 h-4 w-4" />
                {isTrialActive ? "Progress Trial:" : "Trial Berakhir:"}  
              </span>
              <span className="font-medium">
                {isTrialActive 
                  ? formatTrialCountdown(organization.trial_end_date)
                  : new Date(organization.trial_end_date!).toLocaleDateString()}
              </span>
            </div>
            
            <Progress 
              value={isTrialActive ? 100 - calculateTrialProgress() : 0} 
              className="h-2"
              indicatorClassName={styles.progressClass}
            />
            
            <div className="flex justify-between text-xs opacity-70">
              <span>{isTrialActive ? 'Dimulai' : 'Berakhir'}</span>
              <span>{isTrialActive ? 'Berakhir' : 'Upgrade Sekarang'}</span>
            </div>
          </div>
          
          {/* Trial Features Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-opacity-50 flex flex-col items-center text-center">
              <Sparkles className="h-8 w-8 mb-2 text-blue-500" />
              <h4 className="font-medium">Fitur Premium</h4>
              <p className="text-xs opacity-70">Akses ke semua fitur</p>
            </div>
            
            <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-opacity-50 flex flex-col items-center text-center">
              <Info className="h-8 w-8 mb-2 text-blue-500" />
              <h4 className="font-medium">Dukungan Prioritas</h4>
              <p className="text-xs opacity-70">Bantuan teknis prioritas</p>
            </div>
            
            <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-opacity-50 flex flex-col items-center text-center">
              <Clock className="h-8 w-8 mb-2 text-blue-500" />
              <h4 className="font-medium">14 Hari Trial</h4>
              <p className="text-xs opacity-70">
                {isTrialActive 
                  ? `${daysLeftInTrial} hari tersisa` 
                  : "Trial telah berakhir"}
              </p>
            </div>
          </div>
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
        onSuccessfulRequest={handleExtensionSuccess}
      />
    </div>
  );
};

export default TrialDashboard;
