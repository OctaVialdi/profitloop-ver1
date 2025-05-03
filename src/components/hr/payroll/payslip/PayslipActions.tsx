
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer } from "lucide-react";

interface PayslipActionsProps {
  employeeId: string;
  onDownload: () => void;
  onEmail: () => void;
  onPrint: () => void;
}

export const PayslipActions: React.FC<PayslipActionsProps> = ({
  employeeId,
  onDownload,
  onEmail,
  onPrint,
}) => {
  return (
    <div className="text-center p-6 space-y-4">
      <div className="mx-auto bg-green-100 rounded-full p-4 h-20 w-20 flex items-center justify-center">
        <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-medium">Payslip Successfully Generated</h3>
      <p className="text-gray-500">
        The payslip document for {employeeId} is now ready for download or distribution.
      </p>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-4 h-auto"
          onClick={onDownload}
        >
          <Download className="h-5 w-5 mb-1" />
          <span className="text-xs">Download</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-4 h-auto"
          onClick={onEmail}
        >
          <Mail className="h-5 w-5 mb-1" />
          <span className="text-xs">Email</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-4 h-auto"
          onClick={onPrint}
        >
          <Printer className="h-5 w-5 mb-1" />
          <span className="text-xs">Print</span>
        </Button>
      </div>
    </div>
  );
};
