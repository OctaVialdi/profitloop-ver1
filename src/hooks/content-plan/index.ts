import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { useTeamMembersFilter } from './hooks/useTeamMembersFilter';
import { useEmployeesByJobPosition } from './useEmployeesByJobPosition';
import type { LegacyEmployee } from '@/hooks/useEmployees';

// Types
export type TeamMember = {
  id: string;
  name: string;
  department: string;
  role: string;
  job_position: string;
};

export type ContentType = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type SubService = {
  id: string;
  name: string;
  service_id: string;
  created_at: string;
  updated_at: string;
};

export type ContentPillar = {
  id: string;
  name: string;
  funnel_stage: string;
  created_at: string;
  updated_at: string;
};

export type ContentPlanItem = {
  id: string;
  organization_id: string | null;
  post_date: string | null;
  content_type_id: string | null;
  pic_id: string | null;
  service_id: string | null;
  sub_service_id: string | null;
  title: string | null;
  content_pillar_id: string | null;
  brief: string | null;
  status: string | null;
  revision_count: number;
  approved: boolean;
  completion_date: string | null;
  pic_production_id: string | null;
  google_drive_link: string | null;
  production_status: string | null;
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
  content_type?: ContentType;
  service?: Service;
  sub_service?: SubService;
  content_pillar?: ContentPillar;
  pic?: LegacyEmployee;
  pic_production?: LegacyEmployee;
  on_time_status?: string;
};

export interface ContentPlanHookReturn {
  contentPlans: ContentPlanItem[];
  contentTypes: ContentType[];
  teamMembers: LegacyEmployee[];
  services: Service[];
  subServices: SubService[];
  contentPillars: ContentPillar[];
  loading: boolean;
  error: Error | null;
  fetchContentPlans: () => Promise<void>;
  addContentPlan: () => Promise<ContentPlanItem | null>;
  updateContentPlan: (id: string, data: Partial<ContentPlanItem>) => Promise<boolean>;
  deleteContentPlan: (ids: string[]) => Promise<boolean>;
  getFilteredTeamMembers: (department: string) => LegacyEmployee[];
  getFilteredSubServices: (serviceId: string) => SubService[];
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
  getContentPlannerTeamMembers: () => LegacyEmployee[];
  getCreativeTeamMembers: () => LegacyEmployee[];
}

export function useContentPlan(): ContentPlanHookReturn {
  const [contentPlans, setContentPlans] = useState<ContentPlanItem[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use our new hook to get employees instead of team members
  const { 
    contentPlanners, 
    creativeTeam, 
    isLoading: isLoadingEmployees, 
    error: employeesError 
  } = useEmployeesByJobPosition();

  // Combine employee lists for filtering
  const teamMembers = useMemo(() => {
    return [...contentPlanners, ...creativeTeam];
  }, [contentPlanners, creativeTeam]);

  // We'll still use the filter hook but pass our employee data instead
  const { 
    getFilteredTeamMembers, 
    getFilteredSubServices 
  } = useTeamMembersFilter(teamMembers, subServices);

  const fetchContentPlans = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch content types
      const { data: typesData, error: typesError } = await supabase
        .from('content_types')
        .select('*')
        .order('name');
      
      if (typesError) throw typesError;
      setContentTypes(typesData);

      // Fetch team members (we're keeping this fetch for backward compatibility)
      // but we'll use our employee data instead
      
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('name');
      
      if (servicesError) throw servicesError;
      setServices(servicesData);

      // Fetch sub services
      const { data: subServicesData, error: subServicesError } = await supabase
        .from('sub_services')
        .select('*')
        .order('name');
      
      if (subServicesError) throw subServicesError;
      setSubServices(subServicesData);

      // Fetch content pillars
      const { data: pillarsData, error: pillarsError } = await supabase
        .from('content_pillars')
        .select('*')
        .order('name');
      
      if (pillarsError) throw pillarsError;
      setContentPillars(pillarsData);

      // Fetch content plans
      const { data: plansData, error: plansError } = await supabase
        .from('content_plans')
        .select(`
          *,
          content_type:content_types(*),
          service:services(*),
          sub_service:sub_services(*),
          content_pillar:content_pillars(*)
        `)
        .order('post_date', { ascending: false });
      
      if (plansError) throw plansError;

      // Process content plans with employee data
      const processedPlans = plansData.map(plan => {
        // Find matching employees
        const planner = plan.pic_id ? contentPlanners.find(emp => emp.id === plan.pic_id) : undefined;
        const creative = plan.pic_production_id ? creativeTeam.find(emp => emp.id === plan.pic_production_id) : undefined;
        
        // Process on-time status
        let onTimeStatus = '';
        if (plan.done && plan.post_date && plan.actual_post_date) {
          const postDate = new Date(plan.post_date);
          const actualDate = new Date(plan.actual_post_date);
          
          if (actualDate <= postDate) {
            onTimeStatus = 'On Time';
          } else {
            onTimeStatus = 'Late';
          }
        }
        
        return {
          ...plan,
          pic: planner,
          pic_production: creative,
          on_time_status: onTimeStatus
        };
      });
      
      setContentPlans(processedPlans);
    } catch (err) {
      console.error('Error fetching content plans:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [contentPlanners, creativeTeam]);

  // Initial data fetch
  useEffect(() => {
    fetchContentPlans();
  }, [fetchContentPlans]);
  
  // Update error state if employee fetching fails
  useEffect(() => {
    if (employeesError) {
      setError(employeesError);
    }
  }, [employeesError]);

  // Add a new content plan
  const addContentPlan = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('content_plans')
        .insert([{}])
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new plan to the current state
      setContentPlans(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding content plan:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  }, []);

  // Update a content plan
  const updateContentPlan = useCallback(async (id: string, data: Partial<ContentPlanItem>) => {
    try {
      const { error } = await supabase
        .from('content_plans')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the plan in the current state
      setContentPlans(prev => 
        prev.map(plan => 
          plan.id === id 
            ? { ...plan, ...data } 
            : plan
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating content plan:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }, []);

  // Delete content plans
  const deleteContentPlan = useCallback(async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('content_plans')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      // Remove the plans from the current state
      setContentPlans(prev => 
        prev.filter(plan => !ids.includes(plan.id))
      );
      return true;
    } catch (err) {
      console.error('Error deleting content plans:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }, []);

  // Reset a revision counter
  const resetRevisionCounter = useCallback(async (id: string, field: 'revision_count' | 'production_revision_count') => {
    try {
      const { error } = await supabase
        .from('content_plans')
        .update({ [field]: 0 })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the plan in the current state
      setContentPlans(prev => 
        prev.map(plan => 
          plan.id === id 
            ? { ...plan, [field]: 0 } 
            : plan
        )
      );
      return true;
    } catch (err) {
      console.error(`Error resetting ${field}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }, []);

  // Format a date for display
  const formatDisplayDate = useCallback((dateString: string | null, includeTime = false): string => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      return format(date, includeTime ? 'dd MMM yyyy HH:mm' : 'dd MMM yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  }, []);

  // Get content planner team members
  const getContentPlannerTeamMembers = useCallback(() => {
    return contentPlanners;
  }, [contentPlanners]);

  // Get creative team members
  const getCreativeTeamMembers = useCallback(() => {
    return creativeTeam;
  }, [creativeTeam]);

  return {
    contentPlans,
    contentTypes,
    teamMembers, // This now contains the combined employee list
    services,
    subServices,
    contentPillars,
    loading: loading || isLoadingEmployees,
    error,
    fetchContentPlans,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredTeamMembers,
    getFilteredSubServices,
    resetRevisionCounter,
    formatDisplayDate,
    getContentPlannerTeamMembers,
    getCreativeTeamMembers
  };
}

export * from './useContentPlan';
export type { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from './types';
