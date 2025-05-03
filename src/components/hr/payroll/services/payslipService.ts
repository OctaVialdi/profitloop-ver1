
import { toast } from "sonner";

/**
 * Service for handling payslip related operations
 */
export const payslipService = {
  generatePayslip: (employeeId: string): Promise<boolean> => {
    // Simulate API call to generate payslip
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  },
  
  downloadPayslip: (employeeId: string): void => {
    toast.success("Payslip downloaded successfully");
  },
  
  emailPayslip: (employeeId: string): void => {
    toast.success("Payslip sent by email successfully");
  },
  
  printPayslip: (employeeId: string): void => {
    toast.success("Payslip sent to printer");
  }
};
