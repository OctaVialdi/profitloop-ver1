
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";
import { useToast } from "@/components/ui/use-toast";
import TrialFeatureTooltip from "@/components/trial/TrialFeatureTooltip";

interface TrialProtectionProps {
  children: React.ReactNode;
  premiumFeature?: boolean;
  featureName?: string;
  showPreview?: boolean;
}

// This component protects content based on trial/subscription status
const TrialProtection: React.FC<TrialProtectionProps> = ({ 
  children, 
  premiumFeature = false,
  featureName = "Fitur Premium",
  showPreview = false
}) => {
  const organizationData = useOrganization();
  const { toast } = useToast();
  const location = useLocation();
  const [hasShownToast, setHasShownToast] = useState(false);
  
  const isSubscriptionPage = location.pathname === '/subscription' || 
                             location.pathname === '/settings/subscription';
  
  // Check if feature should be restricted
  const shouldRestrict = premiumFeature && 
                         !organizationData.hasPaidSubscription && 
                         !organizationData.isTrialActive;

  useEffect(() => {
    // Show toast only once when a premium feature is attempted to be accessed but restricted
    if (shouldRestrict && !hasShownToast) {
      toast({
        title: "Fitur Premium",
        description: "Fitur ini hanya tersedia untuk pengguna berbayar atau selama masa trial.",
        variant: "destructive",
        action: (
          <a href="/settings/subscription" className="text-sm px-3 py-1 bg-white text-black rounded-md hover:bg-gray-100">
            Upgrade
          </a>
        ),
      });
      setHasShownToast(true);
    }
  }, [shouldRestrict, hasShownToast, toast]);
  
  // Always allow access to the subscription page
  if (isSubscriptionPage) {
    return <>{children}</>;
  }
  
  // For premium features, check if trial/paid plan is active
  if (premiumFeature) {
    // Wrap with tooltip regardless of access status for better UX
    return (
      <TrialFeatureTooltip featureName={featureName} isPremiumOnly={premiumFeature}>
        {organizationData.hasPaidSubscription || organizationData.isTrialActive ? (
          // Access granted - show with premium indicator
          <div className="relative premium-feature">
            {children}
          </div>
        ) : (
          // Access restricted - show locked state or preview
          <div className={`relative ${showPreview ? 'feature-preview' : 'feature-locked'}`}>
            {showPreview ? (
              // Show a previewed/watermarked version
              <div className="opacity-70 pointer-events-none">
                {children}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent flex items-end justify-center pb-2">
                  <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded-full">
                    Fitur Premium
                  </div>
                </div>
              </div>
            ) : (
              // Complete lockout with upgrade prompt
              <div className="p-4 border border-dashed rounded-md bg-gray-50 text-center">
                <p className="text-gray-500 mb-2">Fitur premium tidak tersedia</p>
                <a 
                  href="/settings/subscription" 
                  className="text-blue-600 hover:underline text-sm"
                >
                  Upgrade untuk mengakses fitur ini
                </a>
              </div>
            )}
          </div>
        )}
      </TrialFeatureTooltip>
    );
  }
  
  // For non-premium features, always show content
  return <>{children}</>;
};

export default TrialProtection;
