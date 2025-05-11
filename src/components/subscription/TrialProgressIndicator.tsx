
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TrialStatusLevel } from "@/hooks/useTrialStatus";

interface TrialProgressIndicatorProps {
  daysLeft: number;
  progress: number;
  statusLevel?: TrialStatusLevel;
  className?: string;
  compact?: boolean;
  showButton?: boolean;
}

export const TrialProgressIndicator: React.FC<TrialProgressIndicatorProps> = ({
  daysLeft,
  progress,
  statusLevel = 'normal',
  className,
  compact = false,
  showButton = true
}) => {
  const navigate = useNavigate();
  
  const getProgressColor = () => {
    switch(statusLevel) {
      case 'critical': return "bg-red-500";
      case 'warning': return "bg-amber-500";
      default: return "bg-green-500";
    }
  };
  
  const getTextColor = () => {
    switch(statusLevel) {
      case 'critical': return "text-red-600";
      case 'warning': return "text-amber-600";
      default: return "text-green-600";
    }
  };
  
  const getButtonVariant = () => {
    switch(statusLevel) {
      case 'critical': return "destructive";
      case 'warning': return "secondary";
      default: return "outline";
    }
  };
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      {!compact && (
        <div className="flex items-center justify-between text-sm">
          <div className="font-medium">
            Trial Status: {statusLevel === 'critical' ? "Critical" : statusLevel === 'warning' ? "Warning" : "Active"}
          </div>
          <div className={cn(
            "font-medium",
            getTextColor()
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
            getTextColor()
          )}>
            {daysLeft}d
          </span>
        )}
        
        {showButton && !compact && (
          <Button 
            size="sm" 
            variant={getButtonVariant()}
            onClick={() => navigate("/settings/subscription")}
          >
            Upgrade
          </Button>
        )}
      </div>
    </div>
  );
};
