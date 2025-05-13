
import { useState, useEffect, useCallback } from 'react';
import { LegacyEmployee, convertToLegacyFormat } from '@/hooks/useEmployees';
import { supabase } from '@/lib/supabase';

export function useEmployeesByJobPosition() {
  const [contentPlanners, setContentPlanners] = useState<LegacyEmployee[]>([]);
  const [creativeTeam, setCreativeTeam] = useState<LegacyEmployee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmployeesByPosition = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch employees with job position "Content Planner"
      const { data: contentPlannerData, error: contentPlannerError } = await supabase
        .from('employees')
        .select(`
          *,
          employment:employee_employment(
            job_position, 
            job_level, 
            employment_status,
            organization_name,
            branch
          )
        `)
        .eq('status', 'Active');

      if (contentPlannerError) throw contentPlannerError;

      // Convert the data to LegacyEmployee format
      const allEmployees = contentPlannerData.map(convertToLegacyFormat);

      // Filter for Content Planners
      const planners = allEmployees.filter(emp => 
        emp.jobPosition === 'Content Planner'
      );

      // Filter for Creative team
      const creative = allEmployees.filter(emp => 
        emp.jobPosition === 'Creative'
      );

      setContentPlanners(planners);
      setCreativeTeam(creative);
    } catch (err) {
      console.error('Error fetching employees by job position:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployeesByPosition();
  }, [fetchEmployeesByPosition]);

  return {
    contentPlanners,
    creativeTeam,
    isLoading,
    error,
    fetchEmployeesByPosition
  };
}
