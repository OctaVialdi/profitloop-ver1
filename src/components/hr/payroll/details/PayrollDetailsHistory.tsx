
import React from "react";

interface PayrollHistoryProps {
  employeeData: {
    createdDate: string;
    modifiedDate: string;
  };
}

export const PayrollDetailsHistory: React.FC<PayrollHistoryProps> = ({
  employeeData
}) => {
  return (
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
  );
};
