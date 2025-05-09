
import React from "react";
import { Clock, Calendar, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatTrialCountdown } from "@/utils/organizationUtils";
import { TrialTooltipState } from "@/hooks/trial/useTrialTooltip";

interface TrialActiveContentProps {
  trialEndDate?: string;
  calculateTrialProgress: () => number;
  getProgressColorClass: () => string;
  daysLeftInTrial: number;
  handleUpgradeClick: () => void;
}

const TrialActiveContent: React.FC<TrialActiveContentProps> = ({
  trialEndDate,
  calculateTrialProgress,
  getProgressColorClass,
  daysLeftInTrial,
  handleUpgradeClick
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-blue-700">
        <Clock className="h-4 w-4 flex-shrink-0" />
        <p>Fitur premium tersedia selama masa trial.</p>
      </div>
      
      <div className="bg-blue-50 text-blue-800 p-3 rounded-md border border-blue-100 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Trial berakhir:
          </span>
          <span className="font-bold">{formatTrialCountdown(trialEndDate)}</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>0%</span>
            <span>100%</span>
          </div>
          <Progress 
            value={calculateTrialProgress()} 
            className={`h-2 ${getProgressColorClass()}`} 
          />
        </div>

        {daysLeftInTrial <= 3 && (
          <div className="text-xs text-amber-600 flex items-center mt-1">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {daysLeftInTrial <= 1 
              ? "Trial berakhir dalam kurang dari 24 jam!" 
              : `Trial berakhir dalam ${daysLeftInTrial} hari!`}
          </div>
        )}
      </div>
      
      <div className="pt-1">
        <a 
          href="/settings/subscription"
          onClick={handleUpgradeClick}
          className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 
                   hover:from-blue-600 hover:to-purple-600 text-white text-xs py-2 
                   rounded-md transition-colors"
        >
          Upgrade Sekarang
        </a>
      </div>
    </div>
  );
};

export default TrialActiveContent;
