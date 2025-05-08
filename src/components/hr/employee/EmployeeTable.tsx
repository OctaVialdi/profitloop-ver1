
import React, { useEffect, useState } from 'react';
import { EmployeeList } from '@/components/hr/EmployeeList';
import { useEmployees, LegacyEmployee, convertToLegacyFormat } from '@/hooks/useEmployees';

const EmployeeTable: React.FC = () => {
  const { employees, isLoading } = useEmployees();
  const [employeeData, setEmployeeData] = useState<LegacyEmployee[]>([]);

  useEffect(() => {
    // Convert API format employees to legacy format for the table
    if (employees.length > 0) {
      const legacyEmployees = employees.map(convertToLegacyFormat);
      setEmployeeData(legacyEmployees);
    }
  }, [employees]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">Loading employee data...</span>
      </div>
    );
  }

  return <EmployeeList data={employeeData} />;
};

export default EmployeeTable;
