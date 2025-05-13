
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export interface ContentPlanItem {
  id: string;
  post_date: string;
  content_type_id: string;
  content_type?: { name: string };
  pic_id: string;
  pic?: { name: string };
  service_id: string;
  service?: { name: string };
  sub_service_id: string | null;
  sub_service?: { name: string };
  title: string;
  content_pillar_id: string | null;
  content_pillar?: { name: string };
  brief: string | null;
  status: string;
  revision_count: number;
  approved: boolean;
  completion_date: string | null;
  pic_production_id: string | null;
  pic_production?: { name: string };
  google_drive_link: string | null;
  production_status: string;
  production_revision_count: number;
  production_completion_date: string | null;
  production_approved: boolean;
  production_approved_date: string | null;
  post_link: string | null;
  done: boolean;
  actual_post_date: string | null;
  status_content: string | null;
  created_at: string;
  updated_at: string;
}

interface ContentType {
  id: string;
  name: string;
}

interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
}

interface Service {
  id: string;
  name: string;
}

interface SubService {
  id: string;
  name: string;
  service_id: string;
}

interface ContentPillar {
  id: string;
  name: string;
}

export function useContentPlan() {
  const [contentPlans, setContentPlans] = useState<ContentPlanItem[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContentPlans();
    fetchContentTypes();
    fetchTeamMembers();
    fetchServices();
    fetchSubServices();
    fetchContentPillars();
  }, []);

  const fetchContentPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_plans')
        .select(`
          *,
          content_type:content_type_id(name),
          service:service_id(name),
          sub_service:sub_service_id(name),
          content_pillar:content_pillar_id(name),
          pic:pic_id(name),
          pic_production:pic_production_id(name)
        `)
        .order('post_date');

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        content_type: item.content_type?.name || null,
        service: item.service?.name || null,
        sub_service: item.sub_service?.name || null,
        content_pillar: item.content_pillar?.name || null,
        pic: item.pic?.name || null,
        pic_production: item.pic_production?.name || null
      })) as ContentPlanItem[];
      
      setContentPlans(formattedData);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching content plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setContentTypes(data || []);
    } catch (err) {
      console.error('Error fetching content types:', err);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchSubServices = async () => {
    try {
      const { data, error } = await supabase
        .from('sub_services')
        .select('*')
        .order('name');

      if (error) throw error;
      setSubServices(data || []);
    } catch (err) {
      console.error('Error fetching sub services:', err);
    }
  };

  const fetchContentPillars = async () => {
    try {
      const { data, error } = await supabase
        .from('content_pillars')
        .select('*')
        .order('name');

      if (error) throw error;
      setContentPillars(data || []);
    } catch (err) {
      console.error('Error fetching content pillars:', err);
    }
  };

  const getContentPlansWithFormattedData = () => {
    return contentPlans.map(plan => {
      // Calculate on time status
      let onTimeStatus = '';
      if (plan.actual_post_date && plan.post_date) {
        const actualDate = new Date(plan.actual_post_date);
        const plannedDate = new Date(plan.post_date);
        
        if (actualDate <= plannedDate) {
          onTimeStatus = 'On Time';
        } else {
          const diffTime = Math.abs(actualDate.getTime() - plannedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          onTimeStatus = `Late [${diffDays}] Day/s`;
        }
      }

      return {
        ...plan,
        on_time_status: onTimeStatus
      };
    });
  };

  const addContentPlan = async (newPlan: Partial<ContentPlanItem>) => {
    try {
      const { data, error } = await supabase
        .from('content_plans')
        .insert(newPlan)
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content plan added successfully",
      });
      
      await fetchContentPlans();
      return data[0];
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
      const { error } = await supabase
        .from('content_plans')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content plan updated successfully",
      });
      
      await fetchContentPlans();
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
      const { error } = await supabase
        .from('content_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content plan deleted successfully",
      });
      
      await fetchContentPlans();
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

  const getFilteredTeamMembers = (department: string) => {
    return teamMembers.filter(member => member.department === department);
  };

  const getFilteredSubServices = (serviceId: string) => {
    return subServices.filter(subService => subService.service_id === serviceId);
  };

  const resetRevisionCounter = async (id: string, field: 'revision_count' | 'production_revision_count') => {
    return updateContentPlan(id, { [field]: 0 });
  };

  return {
    contentPlans: getContentPlansWithFormattedData(),
    contentTypes,
    teamMembers,
    services,
    subServices,
    contentPillars,
    loading,
    error,
    fetchContentPlans,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredTeamMembers,
    getFilteredSubServices,
    resetRevisionCounter
  };
}
