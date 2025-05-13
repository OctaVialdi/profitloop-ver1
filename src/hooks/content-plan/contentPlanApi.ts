
import { supabase } from '@/integrations/supabase/client';
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from './types';

export const fetchContentPlans = async (organizationId: string | undefined) => {
  try {
    console.log("API: Fetching content plans for organization:", organizationId);
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
    
    console.log("API: Content plans fetched successfully, count:", data?.length || 0);
    
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

export const fetchTeamMembers = async (organizationId: string | undefined) => {
  try {
    // First get employees from the employees table
    const { data: employeesData, error: employeesError } = await supabase
      .from('employees')
      .select('id, name, organization_id')
      .eq('organization_id', organizationId)
      .order('name');

    if (employeesError) throw employeesError;

    // Then get job positions from employee_employment table
    const { data: employmentData, error: employmentError } = await supabase
      .from('employee_employment')
      .select('employee_id, job_position, job_level');

    if (employmentError) throw employmentError;

    // Combine the data to create team members
    const teamMembers = employeesData.map(employee => {
      const employment = employmentData.find(e => e.employee_id === employee.id);
      
      return {
        id: employee.id,
        name: employee.name,
        department: 'Digital Marketing', // Default department
        job_position: employment?.job_position || '',
        role: employment?.job_level || ''
      };
    });
    
    return teamMembers as TeamMember[];
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
    console.log("API: Adding new content plan item for organization:", organizationId, "with data:", newPlan);
    
    // Include the organization ID in the new plan
    const planWithOrgId = {
      ...newPlan,
      organization_id: organizationId
    };
    
    const { data, error } = await supabase
      .from('content_plans')
      .insert(planWithOrgId)
      .select();

    if (error) {
      console.error("API: Error in insert operation:", error);
      throw error;
    }
    
    console.log("API: Content plan item added successfully:", data?.[0]?.id);
    return data?.[0] as ContentPlanItem;
  } catch (err) {
    console.error('Error adding content plan:', err);
    throw err;
  }
};

export const updateContentPlanItem = async (id: string, updates: Partial<ContentPlanItem>, organizationId: string | undefined) => {
  try {
    console.log("API: Updating content plan item", id, "with data:", updates);
    
    const { error } = await supabase
      .from('content_plans')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) {
      console.error("API: Error in update operation:", error);
      throw error;
    }
    
    console.log("API: Content plan item updated successfully");
    return true;
  } catch (err) {
    console.error('Error updating content plan:', err);
    throw err;
  }
};

export const deleteContentPlanItem = async (id: string, organizationId: string | undefined) => {
  try {
    console.log("API: Deleting content plan item", id);
    
    const { error } = await supabase
      .from('content_plans')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) {
      console.error("API: Error in delete operation:", error);
      throw error;
    }
    
    console.log("API: Content plan item deleted successfully");
    return true;
  } catch (err) {
    console.error('Error deleting content plan:', err);
    throw err;
  }
};
