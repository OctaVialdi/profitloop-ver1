
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
        
        let query = supabase
          .from('employees')
          .select('id, name, organization_id, job_position, job_level');

        // Filter by organization
        if (organization?.id) {
          query = query.eq('organization_id', organization.id);
        }

        // Filter by job position if provided
        if (jobPosition) {
          query = query.eq('job_position', jobPosition);
        }
        
        const { data, error } = await query;

        if (error) throw error;

        setEmployees(data || []);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployees();
  }, [organization?.id, jobPosition]);

  return { employees, isLoading, error };
}
