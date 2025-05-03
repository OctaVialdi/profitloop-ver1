
import React from "react";

interface PayrollCalculationsProps {
  employeeData: {
    overtimeHours: number;
    lateOccurrences: number;
    performanceRating: number;
    bonusEligible: boolean;
  };
}

export const PayrollDetailsCalculations: React.FC<PayrollCalculationsProps> = ({
  employeeData
}) => {
  return (
    <div className="space-y-6">
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
  );
};
