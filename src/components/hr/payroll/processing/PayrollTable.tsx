
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmployeePayrollSummary } from "../types/payroll";

interface PayrollTableProps {
  employees: EmployeePayrollSummary[];
  formatCurrency: (value: number) => string;
  onViewDetails: (employeeId: string) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  employees,
  formatCurrency,
  onViewDetails,
}) => {
  return (
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
            {employees.map((employee) => (
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
  );
};
