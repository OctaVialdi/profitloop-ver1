
import { Crown, Sparkles, Star } from "lucide-react";
import { useMemo } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";

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
  const { hasPaidSubscription, isTrialActive } = useOrganization();
  
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
