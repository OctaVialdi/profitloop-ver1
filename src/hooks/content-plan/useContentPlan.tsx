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
      fetchAllContentPlanData();
    }
  }, [organization]);

  const fetchAllContentPlanData = async () => {
    try {
      await fetchContentPlansData();
      await fetchContentTypesData();
      await fetchTeamMembersData();
      await fetchServicesData();
      await fetchSubServicesData();
      await fetchContentPillarsData();
    } catch (error) {
      console.error("Error fetching content plan data:", error);
    }
  };

  const fetchContentPlansData = async () => {
    try {
      setLoading(true);
      const data = await fetchContentPlans(organization?.id);
      setContentPlans(data);
    } catch (err: any) {
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
      const data = await fetchTeamMembers();
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
      const data = await addContentPlanItem(newPlan, organization?.id);
      
      toast({
        title: "Success",
        description: "Content plan added successfully",
      });
      
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
      await updateContentPlanItem(id, updates, organization?.id);
      
      toast({
        title: "Success",
        description: "Content plan updated successfully",
      });
      
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
      await deleteContentPlanItem(id, organization?.id);
      
      toast({
        title: "Success",
        description: "Content plan deleted successfully",
      });
      
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
    getFilteredTeamMembers: (jobPosition: string) => getFilteredTeamMembers(teamMembers, jobPosition),
    getFilteredSubServices: (serviceId: string) => getFilteredSubServices(subServices, serviceId),
    resetRevisionCounter,
    formatDisplayDate
  };
}
