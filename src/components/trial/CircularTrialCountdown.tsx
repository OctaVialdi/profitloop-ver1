
import React from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";

interface CircularTrialCountdownProps {
  size?: "sm" | "md" | "lg";
  showDays?: boolean;
  showLabel?: boolean;
  className?: string;
}

const CircularTrialCountdown: React.FC<CircularTrialCountdownProps> = ({
  size = "md",
  showDays = true,
  showLabel = true,
  className
}) => {
  const { daysLeftInTrial, isTrialActive } = useOrganization();
  
  // If trial is inactive, show 0 days
  const days = isTrialActive ? daysLeftInTrial : 0;
  
  // Calculate radius and circumference based on size
  const getSizeProps = () => {
    switch (size) {
      case "sm":
        return { size: 36, strokeWidth: 3, fontSize: "text-xs", radius: 14 };
      case "lg":
        return { size: 64, strokeWidth: 4, fontSize: "text-lg", radius: 28 };
      case "md":
      default:
        return { size: 48, strokeWidth: 3, fontSize: "text-sm", radius: 20 };
    }
  };
  
  const { size: circleSize, strokeWidth, fontSize, radius } = getSizeProps();
  const circumference = 2 * Math.PI * radius;
  
  // Calculate progress (0-14 days)
  const maxDays = 14;
  const progress = Math.min(days / maxDays, 1);
  const dashOffset = circumference * (1 - progress);
  
  // Determine color based on days left
  const getColor = () => {
    if (days <= 1) return "text-red-500 stroke-red-500";
    if (days <= 3) return "text-amber-500 stroke-amber-500";
    return "text-blue-500 stroke-blue-500";
  };
  
  const color = getColor();
  
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg 
        width={circleSize} 
        height={circleSize} 
        viewBox={`0 0 ${circleSize} ${circleSize}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      
      {/* Days number in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          {showDays && (
            <span className={cn("font-bold", fontSize, color)}>
              {days}
            </span>
          )}
          {showLabel && (
            <span className="text-xs text-gray-500">hari</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircularTrialCountdown;
