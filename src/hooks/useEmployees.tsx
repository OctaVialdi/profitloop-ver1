
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/hooks/useOrganization';
import { toast } from '@/components/ui/sonner';
import { Employee } from '@/components/hr/employee-list/types';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useOrganization();

  // Fetch employees data
  const fetchEmployees = async () => {
    if (!userProfile?.organization_id) return;

    setIsLoading(true);
    try {
      // This would ideally fetch from a proper employees table in Supabase
      // For now we'll use mock data with the organization members
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .eq('organization_id', userProfile.organization_id);

      if (error) throw error;

      // Transform the data to match our Employee interface
      const employeeData = data.map((item: any) => ({
        id: item.id,
        name: item.full_name || 'Unnamed User',
        email: item.email,
        branch: 'Pusat',
        employmentStatus: 'Permanent',
        joinDate: new Date(item.created_at).toLocaleDateString(),
        // We'd add more fields here from a real employees table
      }));

      setEmployees(employeeData);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees data');
    } finally {
      setIsLoading(false);
    }
  };

  // For demonstration purposes, we'll also provide a mock employee
  const getMockEmployee = (): Employee => ({
    id: '000',
    name: 'Octa Vialdi',
    email: 'admin@vialdi.id',
    branch: 'Pusat',
    organization: '-',
    jobPosition: '-',
    jobLevel: 'No Level',
    employmentStatus: 'Permanent',
    joinDate: '10 Nov 2010',
    endDate: '-',
    signDate: '-',
    resignDate: '-',
    barcode: '-',
    birthDate: '19 Jan 1995',
    birthPlace: 'Jakarta',
    address: '-',
    mobilePhone: '081281714855',
    religion: 'Islam',
    gender: 'Male',
    maritalStatus: 'Married'
  });

  // Add a mock employee if there are none
  const ensureMockData = () => {
    if (employees.length === 0) {
      setEmployees([getMockEmployee()]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.organization_id]);

  useEffect(() => {
    // Add mock data for demonstration after fetching
    if (!isLoading && employees.length === 0) {
      ensureMockData();
    }
  }, [isLoading, employees]);

  return {
    employees,
    isLoading,
    refetch: fetchEmployees
  };
};
