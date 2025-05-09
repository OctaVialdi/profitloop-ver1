
import { Employee } from "@/hooks/useEmployees";

export interface EmployeeMetrics {
  totalEmployees: number;
  totalSalary: number;
  averageSalary: number;
  totalBonus: number;
  totalSickDays: number;
  averageSickDays: number;
  totalCompensation: number;
  totalCommission: number;
}

export interface DepartmentMetric {
  name: string;
  value: number;
  color: string;
}

export interface LocationMetric {
  name: string;
  value: number;
  color: string;
}

export interface CompensationByDepartment {
  name: string;
  salary: number;
  bonus: number;
  commission: number;
}

export interface CompensationByLocation {
  name: string;
  value: number;
}

export interface EmployeeGrowth {
  name: string;
  employees: number;
}

export interface GenderDistribution {
  male: number;
  female: number;
}

/**
 * Calculates HR metrics from employee data
 */
export const calculateHRMetrics = (employees: Employee[]): EmployeeMetrics => {
  const totalEmployees = employees.length;
  
  // In a real app, these would be calculated from actual employee data
  // For now, we'll use mock calculations based on the number of employees
  const averageSalary = 5000;
  const totalSalary = totalEmployees * averageSalary;
  const totalBonus = totalSalary * 0.15;
  const totalSickDays = totalEmployees * 3;
  const averageSickDays = totalEmployees > 0 ? totalSickDays / totalEmployees : 0;
  const totalCompensation = totalSalary + totalBonus;
  const totalCommission = totalSalary * 0.08;
  
  return {
    totalEmployees,
    totalSalary,
    averageSalary,
    totalBonus,
    totalSickDays,
    averageSickDays,
    totalCompensation,
    totalCommission
  };
};

/**
 * Generates department distribution data for charts
 */
export const generateDepartmentData = (): DepartmentMetric[] => {
  return [
    { name: "Engineering", value: 35, color: "#3b82f6" },
    { name: "Marketing", value: 25, color: "#10b981" },
    { name: "Sales", value: 20, color: "#f59e0b" },
    { name: "HR", value: 10, color: "#8b5cf6" },
    { name: "Finance", value: 10, color: "#ec4899" }
  ];
};

/**
 * Generates location distribution data for charts
 */
export const generateLocationData = (): LocationMetric[] => {
  return [
    { name: "Jakarta", value: 40, color: "#3b82f6" },
    { name: "Bandung", value: 25, color: "#10b981" },
    { name: "Surabaya", value: 20, color: "#f59e0b" },
    { name: "Medan", value: 15, color: "#8b5cf6" }
  ];
};

/**
 * Generates compensation by department data for stacked bar chart
 */
export const generateCompensationByDepartment = (): CompensationByDepartment[] => {
  return [
    {
      name: "Engineering",
      salary: 500000,
      bonus: 75000,
      commission: 40000
    },
    {
      name: "Marketing",
      salary: 350000,
      bonus: 52500,
      commission: 28000
    },
    {
      name: "Sales",
      salary: 400000,
      bonus: 60000,
      commission: 80000
    },
    {
      name: "HR",
      salary: 280000,
      bonus: 42000,
      commission: 22400
    },
    {
      name: "Finance",
      salary: 420000,
      bonus: 63000,
      commission: 33600
    }
  ];
};

/**
 * Generates compensation by location data for bar chart
 */
export const generateCompensationByLocation = (): CompensationByLocation[] => {
  return [
    { name: "Jakarta", value: 550000 },
    { name: "Bandung", value: 420000 },
    { name: "Surabaya", value: 480000 },
    { name: "Medan", value: 380000 }
  ];
};

/**
 * Generates employee growth data for bar chart
 */
export const generateEmployeeGrowth = (): EmployeeGrowth[] => {
  return [
    { name: "Jan", employees: 45 },
    { name: "Feb", employees: 48 },
    { name: "Mar", employees: 52 },
    { name: "Apr", employees: 55 },
    { name: "May", employees: 58 },
    { name: "Jun", employees: 62 },
  ];
};

/**
 * Generates gender distribution data
 */
export const generateGenderDistribution = (): GenderDistribution => {
  return {
    male: 58,
    female: 42
  };
};
