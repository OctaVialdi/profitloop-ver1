
import React from "react";
import { AlertTriangle, Clock, InfoIcon } from "lucide-react";

interface TrialExpiredContentProps {
  handleUpgradeClick: () => void;
}

const TrialExpiredContent: React.FC<TrialExpiredContentProps> = ({ 
  handleUpgradeClick 
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p>Fitur premium memerlukan langganan aktif.</p>
      </div>
      
      <div className="bg-amber-50 text-amber-700 p-3 rounded-md border border-amber-100">
        <p className="flex items-center text-sm">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          Trial telah berakhir
        </p>
      </div>
      
      <div className="pt-1 flex gap-2">
        <a 
          href="/settings/subscription"
          onClick={handleUpgradeClick}
          className="block flex-1 text-center bg-gradient-to-r from-blue-500 to-purple-500 
                   hover:from-blue-600 hover:to-purple-600 text-white text-xs py-2 
                   rounded-md transition-colors"
        >
          Upgrade Sekarang
        </a>
        
        <a 
          href="/settings/subscription?request=extension"
          className="block px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 
                   text-xs rounded-md transition-colors"
        >
          <InfoIcon className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};

export default TrialExpiredContent;
