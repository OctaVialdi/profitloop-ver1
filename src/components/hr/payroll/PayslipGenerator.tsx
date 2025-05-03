
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { PayslipGenerationForm } from "./payslip/PayslipGenerationForm";
import { PayslipActions } from "./payslip/PayslipActions";
import { payslipService } from "./services/payslipService";

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
    
    payslipService.generatePayslip(employeeId).then(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      toast.success("Payslip generated successfully");
    });
  };

  const handleDownload = () => {
    payslipService.downloadPayslip(employeeId);
  };

  const handleEmail = () => {
    payslipService.emailPayslip(employeeId);
  };

  const handlePrint = () => {
    payslipService.printPayslip(employeeId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Payslip</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {!isGenerated ? (
            <PayslipGenerationForm 
              employeeId={employeeId}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          ) : (
            <PayslipActions 
              employeeId={employeeId}
              onDownload={handleDownload}
              onEmail={handleEmail}
              onPrint={handlePrint}
            />
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
