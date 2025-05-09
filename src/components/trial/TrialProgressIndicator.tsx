
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { useOrganization } from '@/hooks/useOrganization';
import { Calendar } from 'lucide-react';

interface TrialProgressIndicatorProps {
  className?: string;
}

const TrialProgressIndicator: React.FC<TrialProgressIndicatorProps> = ({ className = '' }) => {
  const { isTrialActive, daysLeftInTrial, organization } = useOrganization();

  if (!isTrialActive || !organization?.trial_end_date) {
    return null;
  }

  // Calculate the percentage of trial days left
  const calculateTrialPercentage = () => {
    // Assuming 14-day trial period
    const totalTrialDays = 14;
    return (daysLeftInTrial / totalTrialDays) * 100;
  };

  // Get the appropriate color class based on days left
  const getProgressColorClass = () => {
    if (daysLeftInTrial <= 1) return "trial-progress-low";
    if (daysLeftInTrial <= 3) return "trial-progress-medium";
    return "trial-progress-high";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span>Status Trial:</span>
        </div>
        <span className="font-medium">{daysLeftInTrial} hari tersisa</span>
      </div>
      
      <Progress 
        value={calculateTrialPercentage()} 
        className="h-2" 
        indicatorClassName={getProgressColorClass()} 
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>0 hari</span>
        <span>14 hari</span>
      </div>
    </div>
  );
};

export default TrialProgressIndicator;
