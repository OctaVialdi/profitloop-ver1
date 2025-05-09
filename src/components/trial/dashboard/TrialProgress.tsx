
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock } from 'lucide-react';
import { formatTrialCountdown } from "@/utils/organizationUtils";
import { Organization } from "@/types/organization";

interface TrialProgressProps {
  organization: Organization | null;
  isTrialActive: boolean;
  daysLeftInTrial: number;
}

const TrialProgress: React.FC<TrialProgressProps> = ({
  organization,
  isTrialActive,
  daysLeftInTrial
}) => {
  // Calculate trial progress percentage
  const calculateTrialProgress = () => {
    if (!organization?.trial_start_date || !organization?.trial_end_date) return 0;
    
    const start = new Date(organization.trial_start_date).getTime();
    const end = new Date(organization.trial_end_date).getTime();
    const now = new Date().getTime();
    const totalDuration = end - start;
    const elapsed = now - start;
    
    // Return elapsed percentage (0 to 100)
    return Math.max(0, Math.min(100, (elapsed / totalDuration * 100)));
  };
  
  // Progress color based on remaining time
  const getProgressColorClass = () => {
    if (daysLeftInTrial <= 1) return 'bg-red-500';
    if (daysLeftInTrial <= 3) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="flex items-center">
          <Calendar className="mr-1.5 h-4 w-4" />
          {isTrialActive ? "Progress Trial:" : "Trial Berakhir:"}  
        </span>
        <span className="font-medium">
          {isTrialActive 
            ? formatTrialCountdown(organization?.trial_end_date)
            : new Date(organization?.trial_end_date || '').toLocaleDateString()}
        </span>
      </div>
      
      <Progress 
        value={isTrialActive ? 100 - calculateTrialProgress() : 0} 
        className="h-2"
        indicatorClassName={getProgressColorClass()}
      />
      
      <div className="flex justify-between text-xs opacity-70">
        <span>{isTrialActive ? 'Dimulai' : 'Berakhir'}</span>
        <span>{isTrialActive ? 'Berakhir' : 'Upgrade Sekarang'}</span>
      </div>
    </div>
  );
};

export default TrialProgress;
