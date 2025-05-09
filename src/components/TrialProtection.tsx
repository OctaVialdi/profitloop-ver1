
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";
import { useToast } from "@/components/ui/use-toast";
import TrialFeatureTooltip from "@/components/trial/TrialFeatureTooltip";
import { Sparkles, Lock } from "lucide-react";
import { trackFeatureAccess } from "@/services/analyticsService";

interface TrialProtectionProps {
  children: React.ReactNode;
  premiumFeature?: boolean;
  featureName?: string;
  showPreview?: boolean;
  previewOpacity?: number; // New prop for controlling preview opacity
  interactivePreview?: boolean; // New prop for allowing limited interaction with preview
}

// This component protects content based on trial/subscription status
const TrialProtection: React.FC<TrialProtectionProps> = ({ 
  children, 
  premiumFeature = false,
  featureName = "Fitur Premium",
  showPreview = false,
  previewOpacity = 0.7, // Default opacity for previews
  interactivePreview = false // Default to non-interactive previews
}) => {
  const organizationData = useOrganization();
  const { toast } = useToast();
  const location = useLocation();
  const [hasShownToast, setHasShownToast] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
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
          <a href="/settings/subscription" className="text-sm px-3 py-1 bg-white text-black rounded-md hover:bg-gray-100 transition-all duration-200">
            Upgrade
          </a>
        ),
      });
      setHasShownToast(true);

      // Track premium feature access attempt
      try {
        const eventData = {
          feature_name: featureName,
          access_granted: false,
          reason: 'trial_expired',
          location: location.pathname
        };
        // Use analytics service if available
        const dataLayer = window.dataLayer;
        if (dataLayer) {
          dataLayer.push({
            event: 'premium_feature_access_attempt',
            ...eventData
          });
        }
        
        // Also track via the analytics service if we have organization ID
        if (organizationData.organization?.id) {
          trackFeatureAccess(
            featureName,
            false,
            'trial_expired',
            organizationData.organization.id
          );
        }
      } catch (error) {
        console.error('Failed to track feature access:', error);
      }
    }
  }, [shouldRestrict, hasShownToast, toast, featureName, location.pathname, organizationData]);
  
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
          <div 
            className="relative premium-feature group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {children}
            <div className={`absolute -top-1 -right-1 bg-gradient-to-br from-blue-400 to-purple-500 text-white
                            rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg
                            transition-all duration-300 ${isHovering ? 'scale-125' : 'scale-100'}`}>
              <Sparkles className="w-3 h-3" />
            </div>
            {organizationData.isTrialActive && (
              <div className={`absolute top-0 right-6 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5
                              rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                Trial Feature
              </div>
            )}
          </div>
        ) : (
          // Access restricted - show locked state or preview
          <div className={`relative ${showPreview ? 'feature-preview' : 'feature-locked'}`}
               onMouseEnter={() => setIsHovering(true)}
               onMouseLeave={() => setIsHovering(false)}>
            {showPreview ? (
              // Show a previewed/watermarked version with enhanced visual cues
              <div className={`relative ${interactivePreview ? '' : 'pointer-events-none'}`} 
                   style={{ opacity: isHovering ? Math.min(previewOpacity + 0.15, 0.95) : previewOpacity }}>
                <div className="relative">
                  {children}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-200 via-transparent to-transparent 
                                  flex items-end justify-center pb-2 transition-opacity duration-300"
                       style={{ opacity: isHovering ? 0.9 : 0.7 }}>
                    <div className="bg-gray-800 text-white text-xs py-1 px-3 rounded-full flex items-center
                                   shadow-lg transform transition-transform duration-300"
                         style={{ transform: isHovering ? 'translateY(-5px) scale(1.05)' : 'translateY(0) scale(1)' }}>
                      <Sparkles className="w-3 h-3 mr-1 text-amber-300" />
                      <span>Fitur Premium</span>
                    </div>
                  </div>
                  
                  {/* Watermark overlay for previews */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                    <div className="watermark-grid">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="text-xs font-bold text-gray-800 rotate-45 opacity-30">
                          PREMIUM
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {isHovering && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-transparent
                                p-3 text-center transform translate-y-0 animate-in slide-in-from-bottom duration-300">
                    <a href="/settings/subscription" 
                       className="text-white text-sm hover:underline focus:outline-none">
                      Upgrade untuk akses penuh
                    </a>
                  </div>
                )}
              </div>
            ) : (
              // Complete lockout with enhanced upgrade prompt
              <div className="p-4 border border-dashed rounded-md bg-gray-50 text-center
                             transition-all duration-300 hover:border-blue-300 hover:bg-blue-50">
                <div className="flex flex-col items-center gap-2">
                  <div className={`rounded-full p-3 mb-1 transition-colors duration-300
                                 ${isHovering ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    <Lock className={`h-5 w-5 transition-transform duration-300 ${isHovering ? 'scale-110' : 'scale-100'}`} />
                  </div>
                  <p className={`mb-3 transition-colors duration-300 ${isHovering ? 'text-blue-700' : 'text-gray-500'}`}>
                    Fitur premium tidak tersedia
                  </p>
                  <a 
                    href="/settings/subscription" 
                    className={`text-sm px-4 py-2 rounded transition-all duration-300
                              ${isHovering 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                                : 'bg-blue-100 text-blue-700'}`}
                  >
                    Upgrade untuk akses
                  </a>
                </div>
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
