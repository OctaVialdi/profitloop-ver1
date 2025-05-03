
import { useState } from 'react';
import useTrialStatus from '@/hooks/useTrialStatus';
import TrialBannerAlert from '@/components/trial/TrialBannerAlert';
import TrialExpiredModal from '@/components/trial/TrialExpiredModal';
import { CountdownTimer } from '@/components/trial/CountdownTimer';

const TrialBanner = () => {
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  const {
    isAuthenticated,
    isLoading,
    daysLeft,
    trialEndDate,
    isTrialExpired,
    handleSubscribe,
    handleSignOut,
    isAuthPage,
    isOnboardingPage,
    isSubscriptionPage
  } = useTrialStatus();
  
  // Use the CountdownTimer hook for managing the countdown
  const { countdownString } = CountdownTimer({ 
    endDate: trialEndDate,
    onExpired: () => {
      if (!isSubscriptionPage && isTrialExpired) {
        setShowSubscriptionDialog(true);
      }
    }
  });

  // Don't show anything if loading, not authenticated, on auth pages, or dismissed
  if (
    isLoading || 
    !isAuthenticated || 
    isAuthPage || 
    isOnboardingPage || 
    isDismissed || 
    daysLeft === null
  ) {
    return null;
  }

  return (
    <>
      {/* Trial banner alert for active trials */}
      {!isTrialExpired && (
        <TrialBannerAlert 
          countdownString={countdownString} 
          daysLeft={daysLeft} 
          onDismiss={() => setIsDismissed(true)}
          onSubscribe={handleSubscribe}
        />
      )}
      
      {/* Trial expired modal */}
      <TrialExpiredModal
        open={isTrialExpired && showSubscriptionDialog && !isSubscriptionPage}
        onOpenChange={setShowSubscriptionDialog}
        onSubscribe={handleSubscribe}
        onSignOut={handleSignOut}
      />
    </>
  );
};

export default TrialBanner;
