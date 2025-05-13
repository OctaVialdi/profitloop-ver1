import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from '@/hooks/useOrganization';
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar, ContentPlanHookReturn } from './types';
import { 
  fetchContentPlans, 
  fetchContentTypes, 
  fetchTeamMembers, 
  fetchServices, 
  fetchSubServices, 
  fetchContentPillars,
  addContentPlanItem,
  updateContentPlanItem,
  deleteContentPlanItem
} from './contentPlanApi';
import { 
  getContentPlansWithFormattedData, 
  getFilteredTeamMembers, 
  getFilteredSubServices, 
  formatDisplayDate 
} from './contentPlanUtils';

export function useContentPlan(): ContentPlanHookReturn {
  const [contentPlans, setContentPlans] = useState<ContentPlanItem[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { organization } = useOrganization();

  useEffect(() => {
    if (organization?.id) {
      console.log('Organization ID available, fetching content plan data:', organization.id);
      fetchAllContentPlanData();
    } else {
      console.log('No organization ID available, cannot fetch content plan data.');
      setError(new Error('No organization ID available'));
    }
  }, [organization?.id]);

  const fetchAllContentPlanData = async () => {
    try {
      console.log('Fetching all content plan data...');
      await fetchContentPlansData();
      await fetchContentTypesData();
      await fetchTeamMembersData();
      await fetchServicesData();
      await fetchSubServicesData();
      await fetchContentPillarsData();
      console.log('All content plan data fetched successfully.');
    } catch (error) {
      console.error("Error fetching content plan data:", error);
    }
  };

  const fetchContentPlansData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching content plans for organization: ${organization?.id}`);
      const data = await fetchContentPlans(organization?.id);
      console.log(`Fetched ${data.length} content plans:`, data);
      setContentPlans(data);
    } catch (err: any) {
      console.error("Error in fetchContentPlansData:", err);
      setError(err);
    } finally {
      setLoading(false);
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
      const data = await fetchTeamMembers(organization?.id);
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

  const addContentPlan = async (newPlan: Partial<ContentPlanItem>) => {
    try {
      console.log(`Adding content plan for organization: ${organization?.id}`, newPlan);
      
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      
      const data = await addContentPlanItem(newPlan, organization.id);
      
      toast({
        title: "Success",
        description: "Content plan added successfully",
      });
      
      console.log(`Content plan added successfully:`, data);
      await fetchContentPlansData();
      return data;
    } catch (err: any) {
      console.error('Error adding content plan:', err);
      toast({
        title: "Error",
        description: `Failed to add content plan: ${err.message}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateContentPlan = async (id: string, updates: Partial<ContentPlanItem>) => {
    try {
      console.log(`Updating content plan ${id} for organization: ${organization?.id}`, updates);
      
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      
      await updateContentPlanItem(id, updates, organization.id);
      
      toast({
        title: "Success",
        description: "Content plan updated successfully",
      });
      
      console.log(`Content plan ${id} updated successfully`);
      await fetchContentPlansData();
      return true;
    } catch (err: any) {
      console.error('Error updating content plan:', err);
      toast({
        title: "Error",
        description: `Failed to update content plan: ${err.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteContentPlan = async (id: string) => {
    try {
      console.log(`Deleting content plan ${id} for organization: ${organization?.id}`);
      
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      
      await deleteContentPlanItem(id, organization.id);
      
      toast({
        title: "Success",
        description: "Content plan deleted successfully",
      });
      
      console.log(`Content plan ${id} deleted successfully`);
      await fetchContentPlansData();
      return true;
    } catch (err: any) {
      console.error('Error deleting content plan:', err);
      toast({
        title: "Error",
        description: `Failed to delete content plan: ${err.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const resetRevisionCounter = async (id: string, field: 'revision_count' | 'production_revision_count') => {
    return updateContentPlan(id, { [field]: 0 });
  };

  // New function to filter team members by job position
  const getTeamMembersByJobPosition = (jobPosition: string): TeamMember[] => {
    return teamMembers.filter(member => member.job_position === jobPosition);
  };

  // Specialized function for content planners
  const getContentPlanners = (): TeamMember[] => {
    return getTeamMembersByJobPosition('Content Planner');
  };

  // Specialized function for creative team members
  const getCreativeTeamMembers = (): TeamMember[] => {
    return getTeamMembersByJobPosition('Creative');
  };

  return {
    contentPlans: getContentPlansWithFormattedData(contentPlans),
    contentTypes,
    teamMembers,
    services,
    subServices,
    contentPillars,
    loading,
    error,
    fetchContentPlans: fetchContentPlansData,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredTeamMembers: (department: string) => getFilteredTeamMembers(teamMembers, department),
    getFilteredSubServices: (serviceId: string) => getFilteredSubServices(subServices, serviceId),
    resetRevisionCounter,
    formatDisplayDate,
    // Add the new specialized functions to the return object
    getTeamMembersByJobPosition,
    getContentPlanners,
    getCreativeTeamMembers
  };
}
