
import { ReactNode, useState } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureProps {
  children: ReactNode;
  tooltip?: string;
  requiresSubscription?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const PremiumFeature = ({
  children,
  tooltip = "This is a premium feature",
  requiresSubscription = true,
  tooltipPosition = 'top'
}: PremiumFeatureProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { isTrialActive, hasPaidSubscription } = useOrganization();
  const navigate = useNavigate();
  
  const hasAccess = !requiresSubscription || isTrialActive || hasPaidSubscription;
  
  // Position classes for the tooltip
  const positionClasses = {
    'top': '-top-12 left-1/2 transform -translate-x-1/2',
    'bottom': 'top-full mt-2 left-1/2 transform -translate-x-1/2',
    'left': 'right-full mr-2 top-1/2 transform -translate-y-1/2',
    'right': 'left-full ml-2 top-1/2 transform -translate-y-1/2'
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (!hasAccess) {
      e.preventDefault();
      e.stopPropagation();
      navigate('/settings/subscription');
      return;
    }
  };
  
  // If the user has access (trial or subscription), just render the children
  if (hasAccess) {
    return (
      <div className="premium-feature group">
        {children}
        <div className="premium-badge w-4 h-4 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-white premium-sparkle" />
        </div>
        {showTooltip && (
          <div className={`premium-tooltip bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 ${positionClasses[tooltipPosition]}`}>
            {tooltip}
            <div className="text-xs mt-1 text-blue-600 font-medium">
              Using as part of your trial
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // If the user doesn't have access, make it look disabled and add tooltip
  return (
    <div 
      className="premium-feature relative cursor-not-allowed opacity-70"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleClick}
    >
      <div className="pointer-events-none">
        {children}
      </div>
      <div className="premium-badge w-4 h-4 flex items-center justify-center">
        <Sparkles className="h-3 w-3 text-white premium-sparkle" />
      </div>
      {showTooltip && (
        <div className={`premium-tooltip ${positionClasses[tooltipPosition]}`}>
          {tooltip}
          <div className="text-xs mt-1 text-blue-600 font-medium">
            Requires subscription
            <button 
              className="ml-1 text-blue-800 underline font-semibold" 
              onClick={() => navigate('/settings/subscription')}
            >
              Upgrade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumFeature;
