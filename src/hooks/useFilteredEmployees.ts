
import { useState, useEffect, useMemo } from "react";
import { useEmployees } from "@/hooks/useEmployees";

export function useFilteredEmployees(organizationFilter?: string) {
  const { employees, isLoading } = useEmployees();
  
  const filteredEmployees = useMemo(() => {
    if (!organizationFilter) return employees;
    
    return employees.filter(employee => 
      employee.organization_name === organizationFilter || 
      employee.organization === organizationFilter
    );
  }, [employees, organizationFilter]);

  return {
    employees: filteredEmployees,
    isLoading
  };
}
