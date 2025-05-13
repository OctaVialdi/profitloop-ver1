
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
}

export interface ContentType {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
}

export interface SubService {
  id: string;
  name: string;
  service_id: string;
}

export interface ContentPillar {
  id: string;
  name: string;
  funnel_stage: string;
}

export interface ContentPlanItem {
  id: string;
  post_date: string;
  content_type_id: string;
  content_type?: ContentType;
  pic_id: string;
  service_id: string;
  sub_service_id: string;
  title: string;
  content_pillar_id: string;
  brief: string;
  status: string;
  revision_count: number;
  approved: boolean;
  completion_date: string;
  pic_production_id: string;
  google_drive_link: string;
  production_status: string;
  production_revision_count: number;
  production_completion_date: string;
  production_approved: boolean;
  production_approved_date: string;
  post_link: string;
  done: boolean;
  actual_post_date: string;
  on_time_status: string;
  status_content: string;
}

export function useContentPlan() {
  const [contentPlans, setContentPlans] = useState<ContentPlanItem[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [loading, setLoading] = useState(true);

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
      const { data, error } = await supabase
        .from("content_plans")
        .select("*")
        .order("post_date", { ascending: false });

      if (error) throw error;
      setContentPlans(data || []);
    } catch (error) {
      console.error("Error fetching content plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("content_types")
        .select("*")
        .order("name");

      if (error) throw error;
      setContentTypes(data || []);
    } catch (error) {
      console.error("Error fetching content types:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("name");

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchSubServices = async () => {
    try {
      const { data, error } = await supabase
        .from("sub_services")
        .select("*")
        .order("name");

      if (error) throw error;
      setSubServices(data || []);
    } catch (error) {
      console.error("Error fetching sub services:", error);
    }
  };

  const fetchContentPillars = async () => {
    try {
      const { data, error } = await supabase
        .from("content_pillars")
        .select("*")
        .order("name");

      if (error) throw error;
      setContentPillars(data || []);
    } catch (error) {
      console.error("Error fetching content pillars:", error);
    }
  };

  const addContentPlan = async (contentPlan: Partial<ContentPlanItem>) => {
    try {
      const { data, error } = await supabase
        .from("content_plans")
        .insert(contentPlan)
        .select();

      if (error) throw error;
      
      setContentPlans([...(data || []), ...contentPlans]);
      return data?.[0]?.id;
    } catch (error) {
      console.error("Error adding content plan:", error);
      return null;
    }
  };

  const updateContentPlan = async (id: string, updates: Partial<ContentPlanItem>) => {
    try {
      const { error } = await supabase
        .from("content_plans")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      setContentPlans(
        contentPlans.map(plan => 
          plan.id === id ? { ...plan, ...updates } : plan
        )
      );

      return true;
    } catch (error) {
      console.error("Error updating content plan:", error);
      return false;
    }
  };

  const deleteContentPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from("content_plans")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setContentPlans(contentPlans.filter(plan => plan.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting content plan:", error);
      return false;
    }
  };

  // Helper functions for filtering team members by department
  const getFilteredTeamMembers = (department: string) => {
    return teamMembers.filter(member => member.department === department);
  };

  // Helper functions for filtering sub-services by service
  const getFilteredSubServices = (serviceId: string) => {
    return subServices.filter(subService => subService.service_id === serviceId);
  };

  // Helper function to reset revision counter
  const resetRevisionCounter = async (id: string, field: 'revision_count' | 'production_revision_count') => {
    const updates = { [field]: 0 };
    await updateContentPlan(id, updates);
  };

  // Helper function to format dates for display
  const formatDisplayDate = (dateStr: string | null, includeTime = false) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return format(date, includeTime ? "dd MMM yyyy HH:mm" : "dd MMM yyyy");
    } catch (error) {
      return dateStr;
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
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredTeamMembers,
    getFilteredSubServices,
    resetRevisionCounter,
    formatDisplayDate
  };
}
