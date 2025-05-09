
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrganization } from '@/hooks/useOrganization';
import { Sparkles, ArrowUp, BadgePercent } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface TrialPersonalizedRecommendationProps {
  className?: string;
}

export const TrialPersonalizedRecommendation: React.FC<TrialPersonalizedRecommendationProps> = ({ 
  className = "" 
}) => {
  const { organization, daysLeftInTrial, isTrialActive } = useOrganization();
  const navigate = useNavigate();
  
  // Debug information
  console.log("TrialPersonalizedRecommendation - isTrialActive:", isTrialActive);
  console.log("TrialPersonalizedRecommendation - daysLeftInTrial:", daysLeftInTrial);
  console.log("TrialPersonalizedRecommendation - organization:", organization);
  
  // If not in trial, don't show anything
  if (!isTrialActive && !organization?.trial_end_date) {
    return null;
  }
  
  // Get appropriate message based on days left
  const getRecommendationMessage = () => {
    if (!isTrialActive) {
      return "Trial Anda telah berakhir. Berlangganan sekarang untuk akses fitur premium!";
    }
    
    if (daysLeftInTrial <= 2) {
      return "Segera! Trial Anda hampir berakhir. Jangan kehilangan akses fitur premium!";
    } else if (daysLeftInTrial <= 5) {
      return "Waktu terbatas! Manfaatkan promo khusus untuk pelanggan trial.";
    } else {
      return "Nikmati pengalaman premium dengan berlangganan sekarang!";
    }
  };

  return (
    <Card className={`border-2 border-blue-200 bg-blue-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Rekomendasi Khusus Trial</h3>
              <p className="text-blue-700 text-sm">{getRecommendationMessage()}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                navigate("/settings/subscription");
              }}
            >
              <BadgePercent className="h-4 w-4 mr-2" />
              Berlangganan 
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrialPersonalizedRecommendation;
