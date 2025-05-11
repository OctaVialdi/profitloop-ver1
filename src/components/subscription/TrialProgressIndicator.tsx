
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TrialProgressIndicatorProps {
  daysLeft: number;
  progress: number;
  className?: string;
  compact?: boolean;
  showButton?: boolean;
}

export const TrialProgressIndicator: React.FC<TrialProgressIndicatorProps> = ({
  daysLeft,
  progress,
  className,
  compact = false,
  showButton = true
}) => {
  const navigate = useNavigate();
  
  // Determine status based on days left
  const isUrgent = daysLeft <= 1;
  const isWarning = daysLeft <= 3 && !isUrgent;
  
  const progressColor = isUrgent 
    ? "bg-red-500" 
    : isWarning 
      ? "bg-amber-500" 
      : "bg-green-500";
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      {!compact && (
        <div className="flex items-center justify-between text-sm">
          <div className="font-medium">
            Trial Status: {isUrgent ? "Critical" : isWarning ? "Warning" : "Active"}
          </div>
          <div className={cn(
            "font-medium",
            isUrgent ? "text-red-600" : isWarning ? "text-amber-600" : "text-green-600"
          )}>
            {daysLeft} {daysLeft === 1 ? "day" : "days"} left
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Progress 
          value={100 - progress} 
          className={cn("h-2 flex-1", compact ? "w-24" : "")}
        />
        
        {compact && (
          <span className={cn(
            "text-xs font-medium",
            isUrgent ? "text-red-600" : isWarning ? "text-amber-600" : "text-green-600"
          )}>
            {daysLeft}d
          </span>
        )}
        
        {showButton && !compact && (
          <Button 
            size="sm" 
            variant={isUrgent ? "destructive" : isWarning ? "secondary" : "outline"}
            onClick={() => navigate("/settings/subscription")}
          >
            Upgrade
          </Button>
        )}
      </div>
    </div>
  );
};
