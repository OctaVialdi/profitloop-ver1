
import { useState, useEffect, useMemo } from "react";
import { useEmployees } from "@/hooks/useEmployees";

export function useEmployeesByPosition(jobPosition?: string) {
  const { employees, isLoading } = useEmployees();
  
  const filteredEmployees = useMemo(() => {
    if (!jobPosition) return employees;
    
    return employees.filter(employee => 
      employee.job_position === jobPosition
    );
  }, [employees, jobPosition]);

  return {
    employees: filteredEmployees,
    isLoading
  };
}
