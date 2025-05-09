
import React from "react";
import { Sparkles } from "lucide-react";

interface TooltipHeaderProps {
  featureName: string;
  isTrialActive: boolean;
  isTrialExpired: boolean;
}

const TooltipHeader: React.FC<TooltipHeaderProps> = ({
  featureName,
  isTrialActive,
  isTrialExpired
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className="font-bold text-blue-700 flex items-center">
        <Sparkles className="w-4 h-4 mr-1.5 text-amber-400" />
        {featureName}
      </p>
      
      {isTrialActive && (
        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
          Trial Active
        </span>
      )}
      
      {isTrialExpired && (
        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
          Trial Expired
        </span>
      )}
    </div>
  );
};

export default TooltipHeader;
