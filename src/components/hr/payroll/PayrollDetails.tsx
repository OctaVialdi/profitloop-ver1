
import React, { useState } from "react";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PayslipGenerator } from "./PayslipGenerator";

interface PayrollDetailsProps {
  employeeId: string;
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'summary' | 'calculations' | 'history';
  setActiveTab: (tab: 'summary' | 'calculations' | 'history') => void;
  onGeneratePayslip: (employeeId: string) => void;
}

interface EmployeePayrollDetail {
  id: string;
  department: string;
  period: string;
  lastModified: string;
  baseSalary: number;
  allowances: number;
  incentives: number;
  deductions: number;
  total: number;
  status: string;
  // Attendance data
  overtimeHours: number;
  lateOccurrences: number;
  // Performance data
  performanceRating: number;
  bonusEligible: boolean;
  // History
  createdDate: string;
  modifiedDate: string;
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

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-500">Employee ID</p>
                  <p className="font-semibold text-lg">{employeeData.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-semibold text-lg">{employeeData.department}</p>
                </div>
                <div>
                  <p className="text-gray-500">Period</p>
                  <p className="font-semibold text-lg">{employeeData.period}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Modified</p>
                  <p className="font-semibold text-lg">{employeeData.lastModified}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Payroll Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Base Salary</span>
                    <span className="font-semibold">{formatCurrency(employeeData.baseSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Allowances</span>
                    <span className="font-semibold">{formatCurrency(employeeData.allowances)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incentives</span>
                    <span className="font-semibold">{formatCurrency(employeeData.incentives)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deductions</span>
                    <span className="font-semibold text-red-500">- {formatCurrency(employeeData.deductions)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg">{formatCurrency(employeeData.total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Status</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employeeData.status === "Draft" 
                      ? "bg-amber-100 text-amber-700"
                      : employeeData.status === "Submitted"
                      ? "bg-blue-100 text-blue-700"
                      : employeeData.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {employeeData.status}
                  </span>
                  <span className="text-gray-500">Payroll is in draft mode and can be edited</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calculations" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Detailed Calculations</h3>

                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-lg">Attendance Data</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 mb-1">Overtime Hours</p>
                      <p className="font-bold text-lg">{employeeData.overtimeHours} hours</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 mb-1">Late Occurrences</p>
                      <p className="font-bold text-lg">{employeeData.lateOccurrences} times</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-lg">Performance Data</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 mb-1">Performance Rating</p>
                      <p className="font-bold text-lg">{employeeData.performanceRating} / 5.0</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 mb-1">Bonus Eligibility</p>
                      <p className="font-bold text-lg">{employeeData.bonusEligible ? 'Eligible' : 'Not Eligible'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-lg">Calculation Formulas</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
{`Gross Salary = Base Salary + Allowances + Incentives
Tax = Gross Salary * 0.05 (5% example rate)
Net Salary = Gross Salary - Tax - Deductions
Overtime Incentive = Overtime Hours * (Base / 173) * 1.5
Performance Bonus = Base * 0.1 (if eligible)`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Payroll History</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">Payroll created</p>
                        <p className="text-gray-500">{employeeData.createdDate}</p>
                      </div>
                      <p className="text-gray-600">Initial payroll record created</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">Payroll modified</p>
                        <p className="text-gray-500">{employeeData.modifiedDate}</p>
                      </div>
                      <p className="text-gray-600">Attendance and performance data imported</p>
                    </div>
                  </div>
                </div>
              </div>
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
