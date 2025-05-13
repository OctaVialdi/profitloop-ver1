
import { supabase } from '@/integrations/supabase/client';
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from './types';

export async function fetchContentPlans(organizationId: string): Promise<ContentPlanItem[]> {
  console.log(`API call: Fetching content plans for organization: ${organizationId}`);
  
  try {
    const { data, error } = await supabase
      .from('content_plans')
      .select(`
        *,
        content_type:content_type_id(id, name),
        pic:pic_id(id, name, job_position, department),
        service:service_id(id, name),
        sub_service:sub_service_id(id, name),
        content_pillar:content_pillar_id(id, name),
        pic_production:pic_production_id(id, name, job_position, department)
      `)
      .eq('organization_id', organizationId)
      .order('post_date', { ascending: true });

    if (error) {
      console.error('Error fetching content plans:', error);
      throw new Error(`Error fetching content plans: ${error.message}`);
    }

    return data as ContentPlanItem[];
  } catch (error) {
    console.error('Unexpected error in fetchContentPlans:', error);
    throw error;
  }
}

export async function fetchContentTypes(): Promise<ContentType[]> {
  try {
    const { data, error } = await supabase
      .from('content_types')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching content types:', error);
      throw new Error(`Error fetching content types: ${error.message}`);
    }

    return data as ContentType[];
  } catch (error) {
    console.error('Unexpected error in fetchContentTypes:', error);
    throw error;
  }
}

export async function fetchTeamMembers(organizationId: string): Promise<TeamMember[]> {
  try {
    console.log(`Fetching team members for organization: ${organizationId}`);
    const { data, error } = await supabase
      .from('team_members_digital_marketing')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name');

    if (error) {
      console.error('Error fetching team members:', error);
      throw new Error(`Error fetching team members: ${error.message}`);
    }

    console.log(`Fetched ${data.length} team members`);
    return data as TeamMember[];
  } catch (error) {
    console.error('Unexpected error in fetchTeamMembers:', error);
    throw error;
  }
}

export async function fetchServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching services:', error);
      throw new Error(`Error fetching services: ${error.message}`);
    }

    return data as Service[];
  } catch (error) {
    console.error('Unexpected error in fetchServices:', error);
    throw error;
  }
}

export async function fetchSubServices(): Promise<SubService[]> {
  try {
    const { data, error } = await supabase
      .from('sub_services')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching sub services:', error);
      throw new Error(`Error fetching sub services: ${error.message}`);
    }

    return data as SubService[];
  } catch (error) {
    console.error('Unexpected error in fetchSubServices:', error);
    throw error;
  }
}

export async function fetchContentPillars(): Promise<ContentPillar[]> {
  try {
    const { data, error } = await supabase
      .from('content_pillars')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching content pillars:', error);
      throw new Error(`Error fetching content pillars: ${error.message}`);
    }

    return data as ContentPillar[];
  } catch (error) {
    console.error('Unexpected error in fetchContentPillars:', error);
    throw error;
  }
}

export async function addContentPlanItem(item: Partial<ContentPlanItem>, organizationId: string): Promise<ContentPlanItem> {
  try {
    // Ensure the item has an organization_id
    const itemWithOrg = {
      ...item,
      organization_id: organizationId
    };

    const { data, error } = await supabase
      .from('content_plans')
      .insert([itemWithOrg])
      .select();

    if (error) {
      console.error('Error adding content plan item:', error);
      throw new Error(`Error adding content plan: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after adding content plan');
    }

    return data[0] as ContentPlanItem;
  } catch (error) {
    console.error('Unexpected error in addContentPlanItem:', error);
    throw error;
  }
}

export async function updateContentPlanItem(id: string, updates: Partial<ContentPlanItem>, organizationId: string): Promise<void> {
  try {
    // Ensure we're only updating valid entries for this organization
    const { error } = await supabase
      .from('content_plans')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error updating content plan item:', error);
      throw new Error(`Error updating content plan: ${error.message}`);
    }
  } catch (error) {
    console.error('Unexpected error in updateContentPlanItem:', error);
    throw error;
  }
}

export async function deleteContentPlanItem(id: string, organizationId: string): Promise<void> {
  try {
    // Ensure we're only deleting valid entries for this organization
    const { error } = await supabase
      .from('content_plans')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error deleting content plan item:', error);
      throw new Error(`Error deleting content plan: ${error.message}`);
    }
  } catch (error) {
    console.error('Unexpected error in deleteContentPlanItem:', error);
    throw error;
  }
}
