
import React from 'react';
import { Clock, Info, Sparkles } from 'lucide-react';

interface FeaturesSummaryProps {
  isTrialActive: boolean;
  daysLeftInTrial: number;
}

const FeaturesSummary: React.FC<FeaturesSummaryProps> = ({
  isTrialActive,
  daysLeftInTrial
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-opacity-50 flex flex-col items-center text-center">
        <Sparkles className="h-8 w-8 mb-2 text-blue-500" />
        <h4 className="font-medium">Fitur Premium</h4>
        <p className="text-xs opacity-70">Akses ke semua fitur</p>
      </div>
      
      <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-opacity-50 flex flex-col items-center text-center">
        <Info className="h-8 w-8 mb-2 text-blue-500" />
        <h4 className="font-medium">Dukungan Prioritas</h4>
        <p className="text-xs opacity-70">Bantuan teknis prioritas</p>
      </div>
      
      <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-opacity-50 flex flex-col items-center text-center">
        <Clock className="h-8 w-8 mb-2 text-blue-500" />
        <h4 className="font-medium">14 Hari Trial</h4>
        <p className="text-xs opacity-70">
          {isTrialActive 
            ? `${daysLeftInTrial} hari tersisa` 
            : "Trial telah berakhir"}
        </p>
      </div>
    </div>
  );
};

export default FeaturesSummary;
