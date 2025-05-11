
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Gift, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PromotionCountdownProps {
  expiresIn?: Date;
  discount?: string;
  onUpgrade?: () => void;
  className?: string;
}

export const PromotionCountdown: React.FC<PromotionCountdownProps> = ({
  expiresIn = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days by default
  discount = "20%",
  onUpgrade,
  className = ""
}) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>("");
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = expiresIn.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [expiresIn]);
  
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/settings/subscription');
    }
  };

  return (
    <Alert className={`bg-amber-50 border-amber-200 text-amber-800 ${className}`}>
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <Gift className="h-5 w-5 text-amber-500 mr-2" />
          <AlertDescription className="text-amber-800">
            <span className="font-bold">{discount} off</span> your first 3 months when you upgrade today!
          </AlertDescription>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm bg-amber-100 px-3 py-1 rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            <span className="font-mono">{timeLeft}</span>
          </div>
          
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={handleUpgrade}>
            Claim Offer
          </Button>
        </div>
      </div>
    </Alert>
  );
};
