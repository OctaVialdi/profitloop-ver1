
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';

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
  const [days, setDays] = useState<number>(0);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  
  // Fetch trial data directly
  useEffect(() => {
    const fetchTrialData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          return;
        }
        
        const orgId = session.user.user_metadata?.organization_id;
        
        if (!orgId) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (!profileData?.organization_id) {
            return;
          }
          
          const { data: orgData } = await supabase
            .from('organizations')
            .select('trial_end_date, trial_expired')
            .eq('id', profileData.organization_id)
            .maybeSingle();
            
          if (orgData) {
            processTrialData(orgData);
          }
        } else {
          const { data: orgData } = await supabase
            .from('organizations')
            .select('trial_end_date, trial_expired')
            .eq('id', orgId)
            .maybeSingle();
            
          if (orgData) {
            processTrialData(orgData);
          }
        }
      } catch (error) {
        console.error("Error fetching trial data:", error);
      }
    };
    
    const processTrialData = (orgData: any) => {
      const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
      const now = new Date();
      
      if (!trialEndDate || orgData.trial_expired || trialEndDate < now) {
        setDays(0);
        setIsTrialActive(false);
      } else {
        const diffTime = trialEndDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDays(diffDays > 0 ? diffDays : 0);
        setIsTrialActive(diffDays > 0);
      }
    };
    
    fetchTrialData();
  }, []);
  
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
