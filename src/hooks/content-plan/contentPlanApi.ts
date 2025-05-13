import { supabase } from '@/integrations/supabase/client';
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from './types';

export const fetchContentPlans = async (organizationId: string | undefined) => {
  try {
    if (!organizationId) {
      console.error("fetchContentPlans: No organization ID provided");
      return [];
    }

    console.log(`Executing fetchContentPlans query with organization_id: ${organizationId}`);
    
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
      .eq('organization_id', organizationId)
      .order('post_date');

    if (error) {
      console.error("Supabase error in fetchContentPlans:", error);
      throw error;
    }
    
    console.log(`fetchContentPlans returned ${data?.length} results`);
    
    // Type assertion to handle the mapping more safely
    const formattedData = (data || []).map(item => ({
      ...item,
      content_type: item.content_type || null,
      service: item.service || null,
      sub_service: item.sub_service || null,
      content_pillar: item.content_pillar || null,
      pic: item.pic || null,
      pic_production: item.pic_production || null
    })) as unknown as ContentPlanItem[];
    
    return formattedData;
  } catch (err: any) {
    console.error('Error in fetchContentPlans:', err);
    throw err;
  }
};

export const fetchContentTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('content_types')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [] as ContentType[];
  } catch (err) {
    console.error('Error fetching content types:', err);
    throw err;
  }
};

export const fetchTeamMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [] as TeamMember[];
  } catch (err) {
    console.error('Error fetching team members:', err);
    throw err;
  }
};

export const fetchServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [] as Service[];
  } catch (err) {
    console.error('Error fetching services:', err);
    throw err;
  }
};

export const fetchSubServices = async () => {
  try {
    const { data, error } = await supabase
      .from('sub_services')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [] as SubService[];
  } catch (err) {
    console.error('Error fetching sub services:', err);
    throw err;
  }
};

export const fetchContentPillars = async () => {
  try {
    const { data, error } = await supabase
      .from('content_pillars')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [] as ContentPillar[];
  } catch (err) {
    console.error('Error fetching content pillars:', err);
    throw err;
  }
};

export const addContentPlanItem = async (newPlan: Partial<ContentPlanItem>, organizationId: string | undefined) => {
  try {
    if (!organizationId) {
      console.error("addContentPlanItem: No organization ID provided");
      throw new Error("Organization ID is required");
    }

    // Include the organization ID in the new plan
    const planWithOrgId = {
      ...newPlan,
      organization_id: organizationId
    };
    
    console.log("Adding new content plan item:", planWithOrgId);
    
    const { data, error } = await supabase
      .from('content_plans')
      .insert(planWithOrgId)
      .select();

    if (error) {
      console.error("Supabase error in addContentPlanItem:", error);
      throw error;
    }

    console.log("Added content plan item successfully:", data);
    
    return data[0] as ContentPlanItem;
  } catch (err) {
    console.error('Error in addContentPlanItem:', err);
    throw err;
  }
};

export const updateContentPlanItem = async (id: string, updates: Partial<ContentPlanItem>, organizationId: string | undefined) => {
  try {
    if (!organizationId) {
      console.error("updateContentPlanItem: No organization ID provided");
      throw new Error("Organization ID is required");
    }

    console.log(`Updating content plan item ${id} with:`, updates);
    
    const { error } = await supabase
      .from('content_plans')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) {
      console.error("Supabase error in updateContentPlanItem:", error);
      throw error;
    }

    console.log(`Content plan item ${id} updated successfully`);
    
    return true;
  } catch (err) {
    console.error('Error in updateContentPlanItem:', err);
    throw err;
  }
};

export const deleteContentPlanItem = async (id: string, organizationId: string | undefined) => {
  try {
    if (!organizationId) {
      console.error("deleteContentPlanItem: No organization ID provided");
      throw new Error("Organization ID is required");
    }

    console.log(`Deleting content plan item ${id}`);
    
    const { error } = await supabase
      .from('content_plans')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) {
      console.error("Supabase error in deleteContentPlanItem:", error);
      throw error;
    }

    console.log(`Content plan item ${id} deleted successfully`);
    
    return true;
  } catch (err) {
    console.error('Error in deleteContentPlanItem:', err);
    throw err;
  }
};
