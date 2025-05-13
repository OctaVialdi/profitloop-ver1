
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

export interface FetchContentPlanReturn {
  contentPlans: ContentPlanItem[];
  contentTypes: ContentType[];
  teamMembers: TeamMember[];
  services: Service[];
  subServices: SubService[];
  contentPillars: ContentPillar[];
  loading: boolean;
  error: Error | null;
  fetchContentPlans: () => Promise<void>;
}

export function useFetchContentPlan(): FetchContentPlanReturn {
  const [contentPlans, setContentPlans] = useState<ContentPlanItem[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { organization } = useOrganization();

  // Effect to fetch data when organization is available
  useEffect(() => {
    if (organization?.id) {
      console.log('Organization ID available, fetching content plan data:', organization.id);
      fetchAllContentPlanData();
      // Clear any previous organization-related errors
      setError(null);
    } else {
      console.log('No organization ID available, cannot fetch content plan data.');
      setError(new Error('No organization ID available'));
      setLoading(false);
    }
  }, [organization?.id]);

  const fetchAllContentPlanData = async () => {
    try {
      console.log('Fetching all content plan data...');
      setLoading(true);
      
      // Run these fetch operations in parallel for better performance
      await Promise.all([
        fetchContentPlansData(),
        fetchContentTypesData(),
        fetchTeamMembersData(),
        fetchServicesData(),
        fetchSubServicesData(),
        fetchContentPillarsData(),
      ]);
      
      console.log('All content plan data fetched successfully.');
    } catch (error) {
      console.error("Error fetching content plan data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentPlansData = async () => {
    try {
      if (!organization?.id) {
        console.log('Skipping content plans fetch - no organization ID');
        return;
      }
      
      console.log(`Fetching content plans for organization: ${organization.id}`);
      const data = await fetchContentPlans(organization.id);
      console.log(`Fetched ${data.length} content plans:`, data);
      setContentPlans(data);
    } catch (err: any) {
      console.error("Error in fetchContentPlansData:", err);
      setError(err);
    }
  };

  const fetchContentTypesData = async () => {
    try {
      const data = await fetchContentTypes();
      setContentTypes(data);
    } catch (err) {
      console.error('Error fetching content types:', err);
    }
  };

  const fetchTeamMembersData = async () => {
    try {
      if (!organization?.id) {
        console.log('Skipping team members fetch - no organization ID');
        return;
      }
      
      const data = await fetchTeamMembers(organization.id);
      setTeamMembers(data);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const fetchServicesData = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchSubServicesData = async () => {
    try {
      const data = await fetchSubServices();
      setSubServices(data);
    } catch (err) {
      console.error('Error fetching sub services:', err);
    }
  };

  const fetchContentPillarsData = async () => {
    try {
      const data = await fetchContentPillars();
      setContentPillars(data);
    } catch (err) {
      console.error('Error fetching content pillars:', err);
    }
  };

  return {
    contentPlans,
    contentTypes,
    teamMembers,
    services,
    subServices,
    contentPillars,
    loading,
    error,
    fetchContentPlans: fetchContentPlansData
  };
}
