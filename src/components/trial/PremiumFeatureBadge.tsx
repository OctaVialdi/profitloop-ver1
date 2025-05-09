
import { Crown, Sparkles, Star } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';

interface PremiumFeatureBadgeProps {
  variant?: "default" | "subtle" | "minimal";
  className?: string;
  position?: "top-right" | "top-left" | "inline";
  showOnActive?: boolean;
}

/**
 * A component that displays a premium feature badge
 */
const PremiumFeatureBadge = ({
  variant = "default",
  className = "",
  position = "top-right",
  showOnActive = false,
}: PremiumFeatureBadgeProps) => {
  const [hasPaidSubscription, setHasPaidSubscription] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  
  // Fetch subscription status directly
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          return;
        }
        
        // Get organization ID from user metadata or profile
        let orgId = session.user.user_metadata?.organization_id;
        
        if (!orgId) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', session.user.id)
            .maybeSingle();
            
          orgId = profileData?.organization_id;
        }
        
        if (orgId) {
          // Get organization data
          const { data: organization } = await supabase
            .from('organizations')
            .select('*, subscription_plans(*)')
            .eq('id', orgId)
            .maybeSingle();
            
          if (organization) {
            // Calculate if trial is active
            const trialEndDate = organization.trial_end_date ? new Date(organization.trial_end_date) : null;
            const trialActive = 
              trialEndDate && 
              !organization.trial_expired && 
              trialEndDate > new Date();
              
            // Check if has paid subscription
            const paidSubscription = 
              !!organization.subscription_plan_id && 
              organization.subscription_plans &&
              organization.subscription_plans.name !== 'Basic' && 
              organization.subscription_status === 'active';
              
            setIsTrialActive(trialActive);
            setHasPaidSubscription(paidSubscription);
          }
        }
      } catch (error) {
        console.error("Error fetching subscription status for badge:", error);
      }
    };
    
    fetchSubscriptionStatus();
  }, []);
  
  // Only show badge for free plan users or during trial if showOnActive is true
  const shouldShow = showOnActive || (!hasPaidSubscription && !isTrialActive);
  
  const positionClasses = useMemo(() => {
    switch (position) {
      case "top-right":
        return "absolute -top-1 -right-1";
      case "top-left":
        return "absolute -top-1 -left-1";
      case "inline":
        return "relative inline-flex ml-1";
      default:
        return "absolute -top-1 -right-1";
    }
  }, [position]);

  // Don't render if we shouldn't show it
  if (!shouldShow) return null;
  
  // Show different badge based on variant
  switch (variant) {
    case "subtle":
      return (
        <div className={cn("premium-badge-subtle", positionClasses, className)}>
          <Star className="h-3 w-3 text-amber-500" />
        </div>
      );
    case "minimal":
      return (
        <div className={cn("premium-badge-minimal", positionClasses, className)}>
          <Sparkles className="h-3 w-3 text-amber-400" />
        </div>
      );
    default:
      return (
        <div className={cn(
          "premium-badge flex items-center justify-center", 
          positionClasses, 
          className
        )}>
          <Crown className="h-3 w-3 text-white" />
        </div>
      );
  }
};

export default PremiumFeatureBadge;
