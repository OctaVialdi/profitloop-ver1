
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PayslipGenerationFormProps {
  employeeId: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const PayslipGenerationForm: React.FC<PayslipGenerationFormProps> = ({
  employeeId,
  isGenerating,
  onGenerate,
}) => {
  return (
    <div className="text-center p-6 space-y-4">
      <div className="mx-auto bg-gray-100 rounded-full p-4 h-20 w-20 flex items-center justify-center">
        <FileText className="h-10 w-10 text-purple-600" />
      </div>
      <h3 className="text-lg font-medium">Generate Payslip for {employeeId}</h3>
      <p className="text-gray-500">
        This will create a PDF payslip document for this employee's April 2025 salary.
      </p>
      
      <Button
        className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
        onClick={onGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Generate Payslip
          </>
        )}
      </Button>
    </div>
  );
};
