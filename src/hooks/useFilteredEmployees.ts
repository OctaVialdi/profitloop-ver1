
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from './useOrganization';

export interface Employee {
  id: string;
  name: string;
  organization_name?: string;
  job_position?: string;
  job_level?: string;
}

export function useFilteredEmployees(jobPosition?: string) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { organization } = useOrganization();

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setIsLoading(true);
        
        // First check if employee_employment table has job_position column
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('id, name, organization_id')
          .eq('organization_id', organization?.id || '');

        if (employeeError) throw employeeError;

        // Then get job positions from employee_employment table
        const { data: employmentData, error: employmentError } = await supabase
          .from('employee_employment')
          .select('employee_id, job_position, job_level');

        if (employmentError) throw employmentError;

        // Combine the data
        const combinedData = employeeData.map(employee => {
          const employment = employmentData.find(e => e.employee_id === employee.id);
          
          return {
            id: employee.id,
            name: employee.name,
            job_position: employment?.job_position || '',
            job_level: employment?.job_level || ''
          };
        });

        // Filter by job position if provided
        const filteredEmployees = jobPosition 
          ? combinedData.filter(emp => emp.job_position === jobPosition)
          : combinedData;
        
        setEmployees(filteredEmployees);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    if (organization?.id) {
      fetchEmployees();
    }
  }, [organization?.id, jobPosition]);

  return { employees, isLoading, error };
}
