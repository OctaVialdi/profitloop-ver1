
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";
import { useToast } from "@/components/ui/use-toast";

interface TrialProtectionProps {
  children: React.ReactNode;
  premiumFeature?: boolean;
}

// This component protects content based on trial/subscription status
const TrialProtection: React.FC<TrialProtectionProps> = ({ 
  children, 
  premiumFeature = false 
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
          <a href="/settings/subscription" className="text-sm px-3 py-1 bg-white text-black rounded-md hover:bg-gray-100">
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
    if (organizationData.hasPaidSubscription || organizationData.isTrialActive) {
      return <>{children}</>;
    }
    
    // If restricted, render a placeholder or nothing
    return (
      <div className="p-4 border border-dashed rounded-md bg-gray-50 text-center">
        <p className="text-gray-500 mb-2">Fitur premium tidak tersedia</p>
        <a 
          href="/settings/subscription" 
          className="text-blue-600 hover:underline text-sm"
        >
          Upgrade untuk mengakses fitur ini
        </a>
      </div>
    );
  }
  
  // For non-premium features, always show content
  return <>{children}</>;
};

export default TrialProtection;
