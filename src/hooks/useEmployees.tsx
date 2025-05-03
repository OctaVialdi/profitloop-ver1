import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

export interface Employee {
  id: string;
  name: string;
  email: string;
  mobilePhone?: string;
  phone?: string; // Added phone property
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  maritalStatus?: string;
  bloodType?: string; // Added bloodType property
  religion?: string;
  address?: string;
  jobPosition?: string;
  jobLevel?: string;
  organization?: string;
  employeeId?: string;
  barcode?: string;
  employmentStatus?: string;
  branch?: string;
  joinDate?: string;
  signDate?: string;
  status: string;
  role: string;
}

export function useEmployees() {
  // Add isLoading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // This is a mock implementation. In a real app, we would fetch this from an API
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "05930e10-a1a2-4f60-83f9-70a922ba4d30",
      name: "Adam Johnson",
      email: "adam.johnson@example.com",
      mobilePhone: "0812-3456-7890",
      phone: "021-123-4567", // Added phone
      birthPlace: "Jakarta",
      birthDate: "15 Jan 1992",
      gender: "Male",
      maritalStatus: "Married",
      bloodType: "O", // Added bloodType
      religion: "Islam",
      address: "Jl. Sudirman No. 123, Jakarta",
      jobPosition: "HR Manager",
      jobLevel: "Senior",
      organization: "HR",
      employeeId: "EMP001",
      barcode: "EMP001/HR",
      employmentStatus: "Permanent",
      branch: "Pusat",
      joinDate: "10 Nov 2010",
      status: "Active",
      role: "HR Manager",
    },
    {
      id: uuidv4(),
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "Active",
      role: "IT Manager",
    },
    {
      id: uuidv4(),
      name: "Robert Lee",
      email: "robert.lee@example.com",
      status: "Active",
      role: "Finance Analyst",
    },
    {
      id: uuidv4(),
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      status: "Inactive",
      role: "Marketing Specialist",
    },
    {
      id: uuidv4(),
      name: "Michael Brown",
      email: "michael.brown@example.com",
      status: "On Leave",
      role: "Software Developer",
    },
  ]);

  // Simulate API loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = {
      ...employee,
      id: uuidv4(),
    };
    setEmployees([...employees, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(
      employees.map((employee) => 
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
    return updatedEmployee;
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  return {
    employees,
    isLoading,
    addEmployee,
    updateEmployee,
    removeEmployee,
  };
}
