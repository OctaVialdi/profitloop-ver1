
export interface EmployeePayrollDetail {
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
