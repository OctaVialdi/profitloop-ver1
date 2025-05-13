
import { supabase } from "@/integrations/supabase/client";
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from "./types";

export async function fetchContentPlans(organizationId?: string): Promise<ContentPlanItem[]> {
  if (!organizationId) {
    console.error('No organization ID provided to fetchContentPlans');
    return [];
  }

  console.log(`Fetching content plans for organization: ${organizationId}`);
  
  const { data, error } = await supabase
    .from('content_plans')
    .select(`
      *,
      content_type:content_type_id(name),
      pic:pic_id(name),
      service:service_id(name),
      sub_service:sub_service_id(name),
      content_pillar:content_pillar_id(name),
      pic_production:pic_production_id(name)
    `)
    .eq('organization_id', organizationId)
    .order('post_date', { ascending: true });
    
  if (error) {
    console.error('Error fetching content plans:', error);
    throw error;
  }
  
  return data || [];
}

export async function fetchContentTypes(): Promise<ContentType[]> {
  const { data, error } = await supabase
    .from('content_types')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching content types:', error);
    throw error;
  }
  
  return data || [];
}

export async function fetchTeamMembers(organizationId?: string): Promise<TeamMember[]> {
  if (!organizationId) {
    console.error('No organization ID provided to fetchTeamMembers');
    return [];
  }
  
  console.log(`Fetching team members for organization: ${organizationId}`);
  
  const { data, error } = await supabase
    .from('team_members_digital_marketing')
    .select('*')
    .eq('organization_id', organizationId)
    .order('name');
    
  if (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
  
  return data || [];
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
  
  return data || [];
}

export async function fetchSubServices(): Promise<SubService[]> {
  const { data, error } = await supabase
    .from('sub_services')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching sub services:', error);
    throw error;
  }
  
  return data || [];
}

export async function fetchContentPillars(): Promise<ContentPillar[]> {
  const { data, error } = await supabase
    .from('content_pillars')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching content pillars:', error);
    throw error;
  }
  
  return data || [];
}

export async function addContentPlanItem(item: Partial<ContentPlanItem>, organizationId: string): Promise<ContentPlanItem> {
  // Extract the IDs for insert, excluding the relational objects
  const itemToInsert = {
    ...item,
    organization_id: organizationId,
    content_type_id: item.content_type_id,
    pic_id: item.pic_id,
    service_id: item.service_id,
    sub_service_id: item.sub_service_id,
    content_pillar_id: item.content_pillar_id,
    pic_production_id: item.pic_production_id
  };
  
  // Remove any relational objects that might be in the item
  delete (itemToInsert as any).content_type;
  delete (itemToInsert as any).pic;
  delete (itemToInsert as any).service;
  delete (itemToInsert as any).sub_service;
  delete (itemToInsert as any).content_pillar;
  delete (itemToInsert as any).pic_production;
  
  console.log(`Adding content plan with org ID ${organizationId}:`, itemToInsert);
  
  const { data, error } = await supabase
    .from('content_plans')
    .insert(itemToInsert)
    .select(`
      *,
      content_type:content_type_id(name),
      pic:pic_id(name),
      service:service_id(name),
      sub_service:sub_service_id(name),
      content_pillar:content_pillar_id(name),
      pic_production:pic_production_id(name)
    `);
    
  if (error) {
    console.error('Error adding content plan item:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    throw new Error('No data returned after insert');
  }
  
  return data[0] as ContentPlanItem;
}

export async function updateContentPlanItem(id: string, updates: Partial<ContentPlanItem>, organizationId: string): Promise<void> {
  // Extract the IDs for update, excluding the relational objects
  const updatesToApply = { ...updates };
  
  // Remove any relational objects that might be in the updates
  delete (updatesToApply as any).content_type;
  delete (updatesToApply as any).pic;
  delete (updatesToApply as any).service;
  delete (updatesToApply as any).sub_service;
  delete (updatesToApply as any).content_pillar;
  delete (updatesToApply as any).pic_production;
  
  console.log(`Updating content plan ${id} for org ${organizationId}:`, updatesToApply);
  
  const { error } = await supabase
    .from('content_plans')
    .update(updatesToApply)
    .eq('id', id)
    .eq('organization_id', organizationId);
    
  if (error) {
    console.error('Error updating content plan item:', error);
    throw error;
  }
}

export async function deleteContentPlanItem(id: string, organizationId: string): Promise<void> {
  console.log(`Deleting content plan ${id} for org ${organizationId}`);
  
  const { error } = await supabase
    .from('content_plans')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);
    
  if (error) {
    console.error('Error deleting content plan item:', error);
    throw error;
  }
}
