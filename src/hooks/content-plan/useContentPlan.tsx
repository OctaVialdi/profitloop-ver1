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

  const addContentPlan = async (newPlan: Partial<ContentPlanItem>) => {
    try {
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      
      console.log(`Adding content plan for organization: ${organization.id}`, newPlan);
      
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
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      
      console.log(`Updating content plan ${id} for organization: ${organization.id}`, updates);
      
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
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      
      console.log(`Deleting content plan ${id} for organization: ${organization.id}`);
      
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

  // Modified function to match the required signature in ContentPlanHookReturn
  const getFilteredTeamMembersWrapper = (department: string): TeamMember[] => {
    return getFilteredTeamMembers(teamMembers, department);
  };

  // Modified function to match the required signature in ContentPlanHookReturn
  const getFilteredSubServicesWrapper = (serviceId: string): SubService[] => {
    return getFilteredSubServices(subServices, serviceId);
  };

  // Utility function to get only Content Planner team members from the list
  const getContentPlannerTeamMembers = () => {
    return teamMembers.filter(member => 
      member.job_position === "Content Planner" || member.department === "Content Planner");
  };
  
  // Utility function to get only Creative team members from the list
  const getCreativeTeamMembers = () => {
    return teamMembers.filter(member => 
      member.job_position === "Creative" || member.department === "Creative" || member.role === "Produksi");
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
    getFilteredTeamMembers: getFilteredTeamMembersWrapper,
    getFilteredSubServices: getFilteredSubServicesWrapper,
    resetRevisionCounter,
    formatDisplayDate,
    getContentPlannerTeamMembers,
    getCreativeTeamMembers
  };
}
