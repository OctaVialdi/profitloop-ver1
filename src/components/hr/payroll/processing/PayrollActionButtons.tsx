
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Filter, Upload, Calculator, Send } from "lucide-react";

interface PayrollActionButtonsProps {
  onImportAttendance: () => void;
  onCalculateAll: () => void;
  onSubmitToFinance: () => void;
}

export const PayrollActionButtons: React.FC<PayrollActionButtonsProps> = ({
  onImportAttendance,
  onCalculateAll,
  onSubmitToFinance,
}) => {
  return (
    <div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" className="flex items-center">
          <Download className="h-4 w-4 mr-1" />
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center">
          <Filter className="h-4 w-4 mr-1" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 justify-end">
        <Button 
          variant="outline" 
          className="bg-white flex items-center gap-1"
          onClick={onImportAttendance}
        >
          <Upload className="h-4 w-4" />
          Import Attendance & Performance
        </Button>
        <Button 
          variant="outline" 
          className="bg-white flex items-center gap-1"
          onClick={onCalculateAll}
        >
          <Calculator className="h-4 w-4" />
          Calculate All
        </Button>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
          onClick={onSubmitToFinance}
        >
          <Send className="h-4 w-4" />
          Submit to Finance
        </Button>
      </div>
    </div>
  );
};
