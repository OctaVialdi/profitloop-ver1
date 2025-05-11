
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumFeatureOverlayProps {
  title: string;
  description: string;
  onUpgrade?: () => void;
  height?: string;
  showPreview?: boolean;
}

export const PremiumFeatureOverlay: React.FC<PremiumFeatureOverlayProps> = ({
  title,
  description,
  onUpgrade,
  height = "300px",
  showPreview = true
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/settings/subscription');
    }
  };

  return (
    <Card className="relative overflow-hidden" style={{ height }}>
      {showPreview && (
        <div className="absolute inset-0 blur-sm opacity-10 pointer-events-none bg-muted"></div>
      )}
      
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 p-6 text-center">
        <div className="mb-4 p-3 bg-primary/10 rounded-full">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        
        <h3 className="text-lg font-semibold flex items-center">
          <Star className="inline-block mr-1 h-4 w-4 text-yellow-500" />
          {title}
          <Star className="inline-block ml-1 h-4 w-4 text-yellow-500" />
        </h3>
        
        <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
          {description}
        </p>
        
        <Button onClick={handleUpgrade}>
          Upgrade to Unlock
        </Button>
      </div>
    </Card>
  );
};
