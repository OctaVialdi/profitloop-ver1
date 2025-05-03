
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PayrollSummaryCardsProps {
  totalEmployees: number;
  totalPayroll: number;
  averageSalary: number;
  selectedPeriod: string;
  formatCurrency: (value: number) => string;
}

export const PayrollSummaryCards: React.FC<PayrollSummaryCardsProps> = ({
  totalEmployees,
  totalPayroll,
  averageSalary,
  selectedPeriod,
  formatCurrency,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-2xl font-bold">{totalEmployees}</p>
            <p className="text-xs text-gray-500">Employees for {selectedPeriod}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Payroll</p>
            <p className="text-2xl font-bold">{formatCurrency(totalPayroll)}</p>
            <p className="text-xs text-gray-500">For {selectedPeriod}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Average Salary</p>
            <p className="text-2xl font-bold">{formatCurrency(averageSalary)}</p>
            <p className="text-xs text-gray-500">Per employee</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Period</p>
            <p className="text-2xl font-bold">{selectedPeriod}</p>
            <p className="text-xs text-gray-500">Current payroll period</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
