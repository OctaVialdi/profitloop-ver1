
import React from "react";

interface PayrollSummaryProps {
  employeeData: {
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
  };
  formatCurrency: (value: number) => string;
}

export const PayrollDetailsSummary: React.FC<PayrollSummaryProps> = ({
  employeeData,
  formatCurrency
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};
