
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { subscriptionAnalyticsService } from '@/services/subscriptionAnalyticsService';

interface TrialProtectionProps {
  children: ReactNode;
  requiredSubscription?: boolean;
}

const ALLOWED_PATHS = ['/subscription', '/settings/subscription', '/auth/login', '/trial-expired'];

const TrialProtection = ({ children, requiredSubscription = false }: TrialProtectionProps) => {
  const { hasPaidSubscription, organization, isLoading } = useOrganization();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if current path is allowed without subscription
  const isAllowedPath = ALLOWED_PATHS.some(path => location.pathname.startsWith(path));
  
  // Determine if access should be blocked
  const blockAccess = 
    !isLoading && 
    requiredSubscription && 
    !hasPaidSubscription && 
    organization?.subscription_status === 'expired' && 
    !isAllowedPath;
  
  // Effect to handle trial expiration
  useEffect(() => {
    if (blockAccess) {
      // Track analytics event for blocked access
      if (organization?.id) {
        subscriptionAnalyticsService.trackEvent({
          eventType: 'premium_feature_clicked',
          organizationId: organization.id,
          additionalData: {
            blockedPath: location.pathname,
            requiredSubscription,
            action: 'redirected_to_trial_expired'
          }
        });
      }
      
      // Redirect to trial expired page
      navigate('/trial-expired', { replace: true });
    }
  }, [blockAccess, location.pathname, organization?.id, requiredSubscription, navigate]);
  
  return <>{children}</>;
};

export default TrialProtection;
