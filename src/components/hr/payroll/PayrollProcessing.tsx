
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Filter, Upload, Search, Calculator, Send } from "lucide-react";
import { toast } from "sonner";

interface PayrollProcessingProps {
  onViewDetails: (employeeId: string) => void;
}

interface EmployeePayroll {
  id: string;
  department: string;
  baseSalary: number;
  allowances: number;
  incentives: number;
  deductions: number;
  total: number;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
}

export const PayrollProcessing: React.FC<PayrollProcessingProps> = ({ onViewDetails }) => {
  const [selectedPeriod] = useState("April 2025");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Example data for the payroll
  const employeePayrollData: EmployeePayroll[] = [
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

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payroll Processing</h2>
      <p className="text-gray-600">Manage and process employee payroll before submission to finance</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold">{totalEmployees}</p>
              <p className="text-xs text-gray-500">Employees for April 2025</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Total Payroll</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPayroll)}</p>
              <p className="text-xs text-gray-500">For April 2025</p>
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
              <p className="text-2xl font-bold">April 2025</p>
              <p className="text-xs text-gray-500">Current payroll period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <div className="bg-white border rounded px-2 py-1">
            <select className="border-none focus:outline-none text-sm">
              <option>All</option>
              <option>IT</option>
              <option>Marketing</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Operations</option>
            </select>
          </div>
          <div className="bg-white border rounded px-2 py-1">
            <select className="border-none focus:outline-none text-sm">
              <option>April 2025</option>
              <option>March 2025</option>
              <option>February 2025</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by Employee ID..."
            className="pl-8 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-1" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 justify-end">
        <Button 
          variant="outline" 
          className="bg-white flex items-center gap-1"
          onClick={handleImportAttendance}
        >
          <Upload className="h-4 w-4" />
          Import Attendance & Performance
        </Button>
        <Button 
          variant="outline" 
          className="bg-white flex items-center gap-1"
          onClick={handleCalculateAll}
        >
          <Calculator className="h-4 w-4" />
          Calculate All
        </Button>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
          onClick={handleSubmitToFinance}
        >
          <Send className="h-4 w-4" />
          Submit to Finance
        </Button>
      </div>

      {/* Employee Payroll Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Employee Payroll</h3>
        <div className="bg-white border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Base Salary</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Incentives</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.baseSalary)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.allowances)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.incentives)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.deductions)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(employee.total)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.status === "Draft" 
                        ? "bg-amber-100 text-amber-700"
                        : employee.status === "Submitted"
                        ? "bg-blue-100 text-blue-700"
                        : employee.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {employee.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={() => onViewDetails(employee.id)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
