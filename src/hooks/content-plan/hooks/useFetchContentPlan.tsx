
import { useState, useEffect } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from '../types';
import { 
  fetchContentPlans, 
  fetchContentTypes, 
  fetchTeamMembers, 
  fetchServices, 
  fetchSubServices, 
  fetchContentPillars
} from '../contentPlanApi';
import { useQuery } from '@tanstack/react-query';
import { LegacyEmployee } from '@/hooks/useEmployees';

export interface FetchContentPlanReturn {
  contentPlans: ContentPlanItem[];
  contentTypes: ContentType[];
  teamMembers: LegacyEmployee[];
  services: Service[];
  subServices: SubService[];
  contentPillars: ContentPillar[];
  loading: boolean;
  error: Error | null;
  fetchContentPlans: () => Promise<void>;
}

export function useFetchContentPlan(): FetchContentPlanReturn {
  const [error, setError] = useState<Error | null>(null);
  const { organization } = useOrganization();
  
  // Query for content plans
  const contentPlansQuery = useQuery({
    queryKey: ['contentPlans', organization?.id],
    queryFn: () => organization?.id ? fetchContentPlans(organization.id) : Promise.resolve([]),
    enabled: !!organization?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for content types
  const contentTypesQuery = useQuery({
    queryKey: ['contentTypes'],
    queryFn: fetchContentTypes,
    staleTime: 30 * 60 * 1000, // 30 minutes (less frequent updates)
  });

  // Query for team members
  const teamMembersQuery = useQuery({
    queryKey: ['teamMembers', organization?.id],
    queryFn: () => organization?.id ? fetchTeamMembers(organization.id) : Promise.resolve([]),
    enabled: !!organization?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Query for services
  const servicesQuery = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Query for sub-services
  const subServicesQuery = useQuery({
    queryKey: ['subServices'],
    queryFn: fetchSubServices,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Query for content pillars
  const contentPillarsQuery = useQuery({
    queryKey: ['contentPillars'],
    queryFn: fetchContentPillars,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Manually fetch content plans (for refreshing after mutations)
  const fetchContentPlansData = async () => {
    try {
      if (!organization?.id) {
        console.log('Skipping content plans fetch - no organization ID');
        return;
      }
      
      await contentPlansQuery.refetch();
    } catch (err: any) {
      console.error("Error in fetchContentPlansData:", err);
      setError(err);
    }
  };

  const loading = 
    contentPlansQuery.isLoading || 
    contentTypesQuery.isLoading || 
    teamMembersQuery.isLoading || 
    servicesQuery.isLoading || 
    subServicesQuery.isLoading || 
    contentPillarsQuery.isLoading;

  // Combine errors from all queries
  const combinedError = 
    error || 
    contentPlansQuery.error || 
    contentTypesQuery.error || 
    teamMembersQuery.error || 
    servicesQuery.error || 
    subServicesQuery.error || 
    contentPillarsQuery.error;
  
  // Convert team members to LegacyEmployee format with correct property mapping
  const convertedTeamMembers = (teamMembersQuery.data || []).map(member => ({
    id: member.id,
    name: member.name,
    jobPosition: member.job_position || '',
    organization: member.department || '',
    role: member.role || '',
    organization_id: organization?.id || '', // Add the required organization_id field
    email: '',  // Add empty required fields to satisfy the type
    status: 'Active',
    employee_id: member.id, // Use the member ID as employee_id
    employeeId: member.id // Legacy alias
  }));

  return {
    contentPlans: contentPlansQuery.data || [],
    contentTypes: contentTypesQuery.data || [],
    teamMembers: convertedTeamMembers,
    services: servicesQuery.data || [],
    subServices: subServicesQuery.data || [],
    contentPillars: contentPillarsQuery.data || [],
    loading,
    error: combinedError as Error | null,
    fetchContentPlans: fetchContentPlansData
  };
}
