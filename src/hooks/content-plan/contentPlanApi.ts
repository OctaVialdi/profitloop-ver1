
import { supabase } from '@/integrations/supabase/client';
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from './types';

export const fetchContentPlans = async (organizationId: string | undefined) => {
  try {
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

    if (error) throw error;
    
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
    console.error('Error fetching content plans:', err);
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
    // Create dummy team members since the employees table doesn't have the required columns
    // This is a temporary solution until the database schema is updated
    const dummyTeamMembers: TeamMember[] = [
      {
        id: '7c4f277a-b3cf-4562-a21a-2b355c635848',
        name: 'Fajar Budiansyah',
        department: 'Digital Marketing',
        job_position: 'Content Planner',
        role: 'Senior'
      },
      {
        id: '966202b8-6e1a-4003-a448-5e8c6a3a4a4a',
        name: 'Yudi',
        department: 'Digital Marketing',
        job_position: 'Creative',
        role: 'Junior'
      },
      {
        id: '3a5b8c7d-9e0f-1a2b-3c4d-5e6f7a8b9c0d',
        name: 'Ahmad Rizal',
        department: 'Digital Marketing',
        job_position: 'Content Planner',
        role: 'Mid'
      },
      {
        id: '4b6c9d0e-2f3g-4h5i-6j7k-8l9m0n1o2p3',
        name: 'Sinta Dewi',
        department: 'Digital Marketing',
        job_position: 'Creative',
        role: 'Senior'
      }
    ];
    
    return dummyTeamMembers;
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
    // Include the organization ID in the new plan
    const planWithOrgId = {
      ...newPlan,
      organization_id: organizationId
    };
    
    const { data, error } = await supabase
      .from('content_plans')
      .insert(planWithOrgId)
      .select();

    if (error) throw error;
    
    return data[0] as ContentPlanItem;
  } catch (err) {
    console.error('Error adding content plan:', err);
    throw err;
  }
};

export const updateContentPlanItem = async (id: string, updates: Partial<ContentPlanItem>, organizationId: string | undefined) => {
  try {
    const { error } = await supabase
      .from('content_plans')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error('Error updating content plan:', err);
    throw err;
  }
};

export const deleteContentPlanItem = async (id: string, organizationId: string | undefined) => {
  try {
    const { error } = await supabase
      .from('content_plans')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error('Error deleting content plan:', err);
    throw err;
  }
};
