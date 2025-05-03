
import React, { useState } from "react";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PayslipGenerator } from "./PayslipGenerator";
import { PayrollDetailsSummary } from "./details/PayrollDetailsSummary";
import { PayrollDetailsCalculations } from "./details/PayrollDetailsCalculations";
import { PayrollDetailsHistory } from "./details/PayrollDetailsHistory";
import { EmployeePayrollDetail } from "./types/payroll";

interface PayrollDetailsProps {
  employeeId: string;
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'summary' | 'calculations' | 'history';
  setActiveTab: (tab: 'summary' | 'calculations' | 'history') => void;
  onGeneratePayslip: (employeeId: string) => void;
}

export const PayrollDetails: React.FC<PayrollDetailsProps> = ({
  employeeId,
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onGeneratePayslip
}) => {
  const [showPayslipGenerator, setShowPayslipGenerator] = useState(false);
  
  // Mock data - in a real app this would be fetched from an API
  const employeeData: EmployeePayrollDetail = {
    id: employeeId,
    department: "IT",
    period: "April 2025",
    lastModified: "03 May 2025 18:04",
    baseSalary: 10000000,
    allowances: 2000000,
    incentives: 3800578,
    deductions: 1403665,
    total: 14396913,
    status: "Draft",
    overtimeHours: 15,
    lateOccurrences: 2,
    performanceRating: 4.5,
    bonusEligible: true,
    createdDate: "10 Apr 2025 00:00",
    modifiedDate: "03 May 2025 18:04"
  };

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const handleGeneratePayslip = () => {
    setShowPayslipGenerator(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Employee Payroll Details</h2>
              <p className="text-gray-500">Payroll information for {employeeId} (April 2025)</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="calculations">Calculations</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <PayrollDetailsSummary employeeData={employeeData} formatCurrency={formatCurrency} />
            </TabsContent>

            <TabsContent value="calculations">
              <PayrollDetailsCalculations employeeData={employeeData} />
            </TabsContent>

            <TabsContent value="history">
              <PayrollDetailsHistory employeeData={employeeData} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleGeneratePayslip}
            >
              <FileText className="h-4 w-4 mr-2" /> Generate Payslip
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {showPayslipGenerator && (
        <PayslipGenerator
          employeeId={employeeId}
          isOpen={showPayslipGenerator}
          onClose={() => setShowPayslipGenerator(false)}
        />
      )}
    </>
  );
};
