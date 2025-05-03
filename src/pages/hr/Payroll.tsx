
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PayrollProcessing } from "@/components/hr/payroll/PayrollProcessing";
import { PayrollDetails } from "@/components/hr/payroll/PayrollDetails";
import { toast } from "sonner";

export default function HRPayroll() {
  const [showPayrollDetails, setShowPayrollDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'calculations' | 'history'>('summary');

  const handleViewDetails = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setShowPayrollDetails(true);
    setActiveTab('summary');
  };

  const handleCloseDetails = () => {
    setShowPayrollDetails(false);
    setSelectedEmployee(null);
  };

  const handleGeneratePayslip = (employeeId: string) => {
    // In a real implementation, this would call an API to generate the payslip
    toast.success(`Payslip for ${employeeId} has been generated successfully.`, {
      description: "The document is now available for download.",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Payroll</CardTitle>
          <CardDescription>
            Salary and compensation management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PayrollProcessing onViewDetails={handleViewDetails} />
        </CardContent>
      </Card>

      {/* Payroll Details Modal */}
      {showPayrollDetails && selectedEmployee && (
        <PayrollDetails 
          employeeId={selectedEmployee} 
          isOpen={showPayrollDetails} 
          onClose={handleCloseDetails} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onGeneratePayslip={handleGeneratePayslip}
        />
      )}
    </div>
  );
}
