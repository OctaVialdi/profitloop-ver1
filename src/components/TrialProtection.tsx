
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";
import { useToast } from "@/components/ui/use-toast";
import TrialFeatureTooltip from "@/components/trial/TrialFeatureTooltip";
import { Crown } from "lucide-react";

interface TrialProtectionProps {
  children: React.ReactNode;
  premiumFeature?: boolean;
  featureName?: string;
  description?: string;
}

// This component protects content based on trial/subscription status
const TrialProtection: React.FC<TrialProtectionProps> = ({ 
  children, 
  premiumFeature = false,
  featureName = "Fitur Premium",
  description,
}) => {
  const organizationData = useOrganization();
  const { toast } = useToast();
  const location = useLocation();
  
  const isSubscriptionPage = location.pathname === '/subscription' || 
                             location.pathname === '/settings/subscription';
  
  // Check if feature should be restricted
  const shouldRestrict = premiumFeature && 
                         !organizationData.hasPaidSubscription && 
                         !organizationData.isTrialActive;

  useEffect(() => {
    // Show toast only once when a premium feature is attempted to be accessed but restricted
    if (shouldRestrict) {
      toast({
        title: "Fitur Premium",
        description: "Fitur ini hanya tersedia untuk pengguna berbayar atau selama masa trial.",
        variant: "destructive",
        action: (
          <a href="/settings/subscription" className="text-sm px-3 py-1 bg-white text-black rounded-md hover:bg-gray-100 transition-colors duration-200">
            Upgrade
          </a>
        ),
      });
    }
  }, [shouldRestrict]);
  
  // Always allow access to the subscription page
  if (isSubscriptionPage) {
    return <>{children}</>;
  }
  
  // For premium features, check if trial/paid plan is active
  if (premiumFeature) {
    // Wrap with tooltip regardless of access status for better UX
    return (
      <TrialFeatureTooltip featureName={featureName} isPremiumOnly={premiumFeature} description={description}>
        {organizationData.hasPaidSubscription || organizationData.isTrialActive ? (
          // Access granted
          <>{children}</>
        ) : (
          // Access restricted
          <div className="premium-feature-restricted p-4 border border-dashed border-amber-300 rounded-md bg-gradient-to-br from-amber-50 to-orange-50 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                <Crown className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-amber-800 font-medium mb-1">Fitur premium tidak tersedia</p>
              <p className="text-amber-700 text-sm mb-2">Upgrade untuk membuka semua fitur</p>
              <a 
                href="/settings/subscription" 
                className="text-sm py-1 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Upgrade Sekarang
              </a>
            </div>
          </div>
        )}
      </TrialFeatureTooltip>
    );
  }
  
  // For non-premium features, always show content
  return <>{children}</>;
};

export default TrialProtection;
