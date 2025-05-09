
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Crown, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { formatTrialCountdown } from "@/utils/organizationUtils";
import PremiumFeatureBadge from "./PremiumFeatureBadge";
import { supabase } from "@/integrations/supabase/client";

interface TrialFeatureTooltipProps {
  children: ReactNode;
  featureName: string;
  isPremiumOnly?: boolean;
  description?: string;
}

const TrialFeatureTooltip = ({
  children,
  featureName,
  isPremiumOnly = false,
  description,
}: TrialFeatureTooltipProps) => {
  const [organizationData, setOrganizationData] = useState({
    isTrialActive: false,
    hasPaidSubscription: false,
    daysLeftInTrial: 0,
    organization: null as any,
  });
  
  // Fetch organization data directly for the tooltip
  useEffect(() => {
    const fetchOrganizationInfo = async () => {
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
            const isTrialActive = 
              trialEndDate && 
              !organization.trial_expired && 
              trialEndDate > new Date();
              
            // Calculate days left
            const diffTime = trialEndDate ? trialEndDate.getTime() - new Date().getTime() : 0;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Check if has paid subscription
            const hasPaidSubscription = 
              !!organization.subscription_plan_id && 
              organization.subscription_plans &&
              organization.subscription_plans.name !== 'Basic' && 
              organization.subscription_status === 'active';
              
            setOrganizationData({
              isTrialActive,
              hasPaidSubscription,
              daysLeftInTrial: diffDays > 0 ? diffDays : 0,
              organization
            });
          }
        }
      } catch (error) {
        console.error("Error fetching organization data for tooltip:", error);
      }
    };
    
    fetchOrganizationInfo();
  }, []);
  
  // If user has active subscription or feature is not premium-only, just show the children
  if (organizationData.hasPaidSubscription || !isPremiumOnly) {
    return <>{children}</>;
  }
  
  const showTooltip = isPremiumOnly && !organizationData.hasPaidSubscription;
  const isTrialExpired = !organizationData.isTrialActive && !organizationData.hasPaidSubscription;
  const trialEndDate = organizationData.organization?.trial_end_date;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <div className={`relative ${isTrialExpired ? 'feature-locked' : ''}`}>
          <TooltipTrigger asChild>
            <div className="group">
              {children}
              {showTooltip && <PremiumFeatureBadge variant="minimal" />}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            align="center" 
            className="premium-tooltip-content max-w-[280px] p-4 animate-in fade-in-50 zoom-in-95 duration-300"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {organizationData.isTrialActive ? (
                  <Sparkles className="h-4 w-4 text-amber-500" />
                ) : (
                  <Crown className="h-4 w-4 text-purple-500" />
                )}
                <h4 className="font-semibold text-sm">{featureName}</h4>
              </div>
              
              <p className="text-xs text-muted-foreground mb-1">
                {description || "Fitur premium untuk meningkatkan produktivitas dan efisiensi bisnis Anda."}
              </p>
              
              {organizationData.isTrialActive ? (
                <div className="premium-status-indicator trial">
                  <div className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 p-2 rounded-md border border-blue-100">
                    Tersedia selama masa trial • Berakhir {formatTrialCountdown(trialEndDate)}
                  </div>
                </div>
              ) : (
                <div className="premium-status-indicator locked">
                  <div className="text-xs bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 p-2 rounded-md border border-amber-100">
                    Fitur premium memerlukan langganan • Trial telah berakhir
                  </div>
                </div>
              )}
              
              <a 
                href="/settings/subscription" 
                className="text-xs mt-1 text-purple-600 hover:text-purple-700 font-medium self-end"
              >
                Upgrade Sekarang →
              </a>
            </div>
          </TooltipContent>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TrialFeatureTooltip;
