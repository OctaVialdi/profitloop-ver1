
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PayrollRecord {
  department: string;
  employeeId: string;
  period: string;
  baseSalary: number;
  allowance: number;
  incentives: number;
  deductions: number;
  total: number;
  status: string;
}

const payrollData: PayrollRecord[] = [
  {
    department: "IT",
    employeeId: "EMP001",
    period: "April 2025",
    baseSalary: 10000000,
    allowance: 2000000,
    incentives: 1500000,
    deductions: 500000,
    total: 13000000,
    status: "PENDING FINANCE"
  },
  {
    department: "Marketing",
    employeeId: "EMP045",
    period: "April 2025",
    baseSalary: 8000000,
    allowance: 1000000,
    incentives: 3000000,
    deductions: 400000,
    total: 11600000,
    status: "PENDING FINANCE"
  },
  {
    department: "HR",
    employeeId: "EMP078",
    period: "April 2025",
    baseSalary: 7000000,
    allowance: 1000000,
    incentives: 500000,
    deductions: 300000,
    total: 8200000,
    status: "PENDING FINANCE"
  }
];

const formatCurrency = (value: number) => {
  return `Rp ${value.toLocaleString()}`;
};

export default function PayrollTable() {
  return (
    <div className="border rounded-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-600 font-medium">Department</TableHead>
              <TableHead className="text-gray-600 font-medium">Employee ID</TableHead>
              <TableHead className="text-gray-600 font-medium">Period</TableHead>
              <TableHead className="text-gray-600 font-medium">Base Salary</TableHead>
              <TableHead className="text-gray-600 font-medium">Allowance</TableHead>
              <TableHead className="text-gray-600 font-medium">Incentives</TableHead>
              <TableHead className="text-gray-600 font-medium">Deductions</TableHead>
              <TableHead className="text-gray-600 font-medium">Total</TableHead>
              <TableHead className="text-gray-600 font-medium">Status</TableHead>
              <TableHead className="text-gray-600 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollData.map((record, index) => (
              <TableRow key={record.employeeId} className="border-b hover:bg-gray-50">
                <TableCell className="font-medium">{record.department}</TableCell>
                <TableCell>{record.employeeId}</TableCell>
                <TableCell>{record.period}</TableCell>
                <TableCell>{formatCurrency(record.baseSalary)}</TableCell>
                <TableCell>{formatCurrency(record.allowance)}</TableCell>
                <TableCell>{formatCurrency(record.incentives)}</TableCell>
                <TableCell>{formatCurrency(record.deductions)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(record.total)}</TableCell>
                <TableCell>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-xs font-medium">
                    {record.status}
                  </span>
                </TableCell>
                <TableCell>
                  {index === 0 ? (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-md">
                      Selected
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
