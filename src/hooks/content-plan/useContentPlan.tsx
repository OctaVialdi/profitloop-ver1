
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
      console.log("Fetching all content plan data...");
      await fetchContentPlansData();
      await fetchContentTypesData();
      await fetchTeamMembersData();
      await fetchServicesData();
      await fetchSubServicesData();
      await fetchContentPillarsData();
      console.log("All content plan data fetched successfully");
    } catch (error) {
      console.error("Error fetching content plan data:", error);
    }
  };

  const fetchContentPlansData = async () => {
    try {
      setLoading(true);
      console.log("Fetching content plans for organization:", organization?.id);
      const data = await fetchContentPlans(organization?.id);
      console.log("Content plans fetched:", data.length, "items");
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
      console.log("Adding new content plan:", newPlan);
      const data = await addContentPlanItem(newPlan, organization?.id);
      
      toast({
        title: "Success",
        description: "Content plan added successfully",
      });
      
      // Fetch latest data from the server instead of updating state directly
      await fetchContentPlansData();
      console.log("Data refetched after adding content plan");
      
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
      console.log("Updating content plan:", id, updates);
      await updateContentPlanItem(id, updates, organization?.id);
      
      toast({
        title: "Success",
        description: "Content plan updated successfully",
      });
      
      // Fetch latest data from the server instead of updating state directly
      await fetchContentPlansData();
      console.log("Data refetched after updating content plan");
      
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
      console.log("Deleting content plan:", id);
      await deleteContentPlanItem(id, organization?.id);
      
      toast({
        title: "Success",
        description: "Content plan deleted successfully",
      });
      
      // Fetch latest data from the server instead of updating state directly
      await fetchContentPlansData();
      console.log("Data refetched after deleting content plan");
      
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
