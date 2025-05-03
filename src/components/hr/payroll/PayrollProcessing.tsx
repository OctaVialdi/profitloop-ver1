
import React, { useState } from "react";
import { toast } from "sonner";
import { PayrollSummaryCards } from "./processing/PayrollSummaryCards";
import { PayrollFilters } from "./processing/PayrollFilters";
import { PayrollActionButtons } from "./processing/PayrollActionButtons";
import { PayrollTable } from "./processing/PayrollTable";
import { EmployeePayrollSummary } from "./types/payroll";
import { formatCurrency } from "./utils/formatters";

interface PayrollProcessingProps {
  onViewDetails: (employeeId: string) => void;
}

export const PayrollProcessing: React.FC<PayrollProcessingProps> = ({ onViewDetails }) => {
  const [selectedPeriod] = useState("April 2025");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Example data for the payroll
  const employeePayrollData: EmployeePayrollSummary[] = [
    {
      id: "EMP001",
      department: "IT",
      baseSalary: 10000000,
      allowances: 2000000,
      incentives: 3800578,
      deductions: 1403665,
      total: 14396913,
      status: "Draft"
    },
    {
      id: "EMP045",
      department: "Marketing",
      baseSalary: 8000000,
      allowances: 1000000,
      incentives: 4354913,
      deductions: 1067746,
      total: 12287167,
      status: "Draft"
    },
    {
      id: "EMP078",
      department: "HR",
      baseSalary: 7000000,
      allowances: 1000000,
      incentives: 803468,
      deductions: 779946,
      status: "Draft",
      total: 8023522
    },
    {
      id: "EMP102",
      department: "Finance",
      baseSalary: 9500000,
      allowances: 1800000,
      incentives: 2973699,
      deductions: 1163685,
      status: "Draft",
      total: 13110014
    },
    {
      id: "EMP156",
      department: "Operations",
      baseSalary: 8500000,
      allowances: 1500000,
      incentives: 1684393,
      deductions: 1079106,
      status: "Draft",
      total: 10605287
    },
  ];

  const totalEmployees = employeePayrollData.length;
  const totalPayroll = employeePayrollData.reduce((sum, employee) => sum + employee.total, 0);
  const averageSalary = totalPayroll / totalEmployees;
  
  const filteredEmployees = employeePayrollData.filter(emp => 
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImportAttendance = () => {
    toast.success("Attendance and performance data imported successfully", {
      description: "Employee payroll calculations have been updated.",
    });
  };

  const handleCalculateAll = () => {
    toast.success("All payroll calculations completed", {
      description: "Employee payroll totals have been updated.",
    });
  };

  const handleSubmitToFinance = () => {
    toast.success("Payroll submitted to Finance for approval", {
      description: "You will be notified when it's approved.",
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payroll Processing</h2>
      <p className="text-gray-600">Manage and process employee payroll before submission to finance</p>

      {/* Summary Cards */}
      <PayrollSummaryCards
        totalEmployees={totalEmployees}
        totalPayroll={totalPayroll}
        averageSalary={averageSalary}
        selectedPeriod={selectedPeriod}
        formatCurrency={formatCurrency}
      />

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <PayrollFilters 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange}
        />
        
        <PayrollActionButtons 
          onImportAttendance={handleImportAttendance}
          onCalculateAll={handleCalculateAll}
          onSubmitToFinance={handleSubmitToFinance}
        />
      </div>

      {/* Employee Payroll Table */}
      <PayrollTable 
        employees={filteredEmployees}
        formatCurrency={formatCurrency}
        onViewDetails={onViewDetails}
      />
    </div>
  );
};
