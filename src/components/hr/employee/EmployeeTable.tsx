
import React, { useEffect, useState } from 'react';
import { EmployeeList } from '@/components/hr/EmployeeList';
import { useEmployees, LegacyEmployee, convertToLegacyFormat } from '@/hooks/useEmployees';
import { Card, CardContent } from '@/components/ui/card';
import { CircleDashed } from 'lucide-react';

const EmployeeTable: React.FC = () => {
  const { employees, isLoading, error } = useEmployees();
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
      <Card className="border border-muted/40">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="relative w-10 h-10">
            <div className="animate-spin absolute inset-0 border-t-transparent border-2 border-primary rounded-full"></div>
            <CircleDashed className="w-10 h-10 text-muted-foreground/30 absolute inset-0" />
          </div>
          <p className="text-muted-foreground mt-4 text-sm">Loading employee data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/30">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-red-800 dark:text-red-300">Failed to load employee data</h3>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">Please try again or contact support if the problem persists.</p>
        </CardContent>
      </Card>
    );
  }

  return <EmployeeList data={employeeData} />;
};

export default EmployeeTable;
