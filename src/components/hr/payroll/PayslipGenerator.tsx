
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Download, Mail, Printer } from "lucide-react";
import { toast } from "sonner";

interface PayslipGeneratorProps {
  employeeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PayslipGenerator: React.FC<PayslipGeneratorProps> = ({
  employeeId,
  isOpen,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate API call to generate payslip
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      toast.success("Payslip generated successfully");
    }, 1500);
  };

  const handleDownload = () => {
    toast.success("Payslip downloaded successfully");
  };

  const handleEmail = () => {
    toast.success("Payslip sent by email successfully");
  };

  const handlePrint = () => {
    toast.success("Payslip sent to printer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Payslip</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {!isGenerated ? (
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
                onClick={handleGenerate}
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
          ) : (
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
                  onClick={handleDownload}
                >
                  <Download className="h-5 w-5 mb-1" />
                  <span className="text-xs">Download</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center p-4 h-auto"
                  onClick={handleEmail}
                >
                  <Mail className="h-5 w-5 mb-1" />
                  <span className="text-xs">Email</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center p-4 h-auto"
                  onClick={handlePrint}
                >
                  <Printer className="h-5 w-5 mb-1" />
                  <span className="text-xs">Print</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
